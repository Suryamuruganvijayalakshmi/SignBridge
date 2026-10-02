import React, {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef
} from 'react';
import gsap from 'gsap';

export const Card = forwardRef(({ customClass = '', className = '', style = {}, children, ...rest }, ref) => (
    <div
        ref={ref}
        {...rest}
        style={style}
        className={`card-swap-item ${customClass} ${className}`.trim()}
    >
        {children}
    </div>
));

Card.displayName = 'Card';

/**
 * Slot calculator for 3D perspective deck
 * Tapers depth, scale, and opacity evenly across cards
 */
const makeSlot = (i, distX, distY, total) => {
    // Graceful opacity falloff for deeper cards in large decks (e.g. 12 cards)
    const opacity = i > 4 ? Math.max(0.18, 1 - (i - 3) * 0.14) : 1;
    const scale = Math.max(0.82, 1 - i * 0.022);

    return {
        x: i * distX,
        y: -i * distY,
        z: -i * distX * 1.6,
        zIndex: total - i,
        scale,
        opacity
    };
};

const placeNow = (el, slot, skew) => {
    if (!el) return;
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        scale: slot.scale,
        opacity: slot.opacity,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
    });
};

export const CardSwap = forwardRef(({
    width = 420,
    height = 500,
    cardDistance = 45,
    verticalDistance = 40,
    delay = 5000,
    pauseOnHover = true,
    onCardClick,
    onActiveIndexChange,
    skewAmount = 4,
    easing = 'smooth', // 'smooth' uses synchronized power3.out with equal timing
    children
}, ref) => {
    const childArr = useMemo(() => Children.toArray(children), [children]);
    const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);
    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const tlRef = useRef(null);
    const intervalRef = useRef(0);
    const container = useRef(null);

    // Keep activeIndex synced cleanly
    const onActiveIndexChangeRef = useRef(onActiveIndexChange);
    useEffect(() => {
        onActiveIndexChangeRef.current = onActiveIndexChange;
    }, [onActiveIndexChange]);

    // Reset auto-cycle timer helper
    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = 0;
        }
        if (delay > 0) {
            intervalRef.current = window.setInterval(() => {
                swapNext();
            }, delay);
        }
    };

    /**
     * swapNext — Advances to the next card in order with equal timing
     */
    const swapNext = () => {
        const total = order.current.length;
        if (total < 2) return;

        // If an animation is in flight, cleanly cancel it to stay responsive
        if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
        }

        const currentFront = order.current[0];
        const nextFront = order.current[1];
        const rest = order.current.slice(1);

        const elFront = refs[currentFront]?.current;
        if (!elFront) return;

        // Immediately notify parent about the new active card
        if (onActiveIndexChangeRef.current) {
            onActiveIndexChangeRef.current(nextFront);
        }

        const tl = gsap.timeline({
            onComplete: () => {
                order.current = [...rest, currentFront];
                // Ensure all items are precisely placed
                order.current.forEach((idx, i) => {
                    const el = refs[idx]?.current;
                    if (el) {
                        const slot = makeSlot(i, cardDistance, verticalDistance, total);
                        placeNow(el, slot, skewAmount);
                    }
                });
                tlRef.current = null;
            }
        });
        tlRef.current = tl;

        // 1. Front card drops down smoothly
        tl.to(elFront, {
            y: '+=240',
            opacity: 0.25,
            scale: 0.92,
            duration: 0.35,
            ease: 'power2.in'
        }, 0);

        // 2. All remaining cards glide forward 1 slot in perfect unison (EQUAL TIMING)
        rest.forEach((idx, i) => {
            const el = refs[idx]?.current;
            if (!el) return;
            const targetSlot = makeSlot(i, cardDistance, verticalDistance, total);

            tl.set(el, { zIndex: targetSlot.zIndex }, 0.05);
            tl.to(el, {
                x: targetSlot.x,
                y: targetSlot.y,
                z: targetSlot.z,
                scale: targetSlot.scale,
                opacity: targetSlot.opacity,
                duration: 0.6,
                ease: 'power3.out'
            }, 0.05);
        });

        // 3. Front card tucks into the back slot
        const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
        tl.set(elFront, {
            x: backSlot.x,
            z: backSlot.z,
            zIndex: backSlot.zIndex
        }, 0.35);

        tl.to(elFront, {
            y: backSlot.y,
            opacity: backSlot.opacity,
            scale: backSlot.scale,
            duration: 0.38,
            ease: 'power3.out'
        }, 0.35);
    };

    /**
     * swapPrev — Cycles backward in deck
     */
    const swapPrev = () => {
        const total = order.current.length;
        if (total < 2) return;

        if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
        }

        const lastItem = order.current[total - 1];
        const newOrder = [lastItem, ...order.current.slice(0, total - 1)];

        goTo(lastItem);
    };

    /**
     * goTo — Instantly navigates to a specific child index on single click!
     * Smoothly rotates the circular deck to bring target to the front slot.
     */
    const goTo = (targetIndex) => {
        const total = order.current.length;
        if (total === 0) return;

        // Reset auto-cycle timer so user has ample time to inspect the clicked member
        resetInterval();

        // 1. Immediately kill any in-flight timeline — NO LOCKOUT, SINGLE CLICK ALWAYS REGISTERS
        if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
        }

        // If target is already at the front, ensure spotlight is active and add gentle pulse
        if (order.current[0] === targetIndex) {
            if (onActiveIndexChangeRef.current) {
                onActiveIndexChangeRef.current(targetIndex);
            }
            const frontEl = refs[targetIndex]?.current;
            if (frontEl) {
                gsap.fromTo(frontEl, 
                    { scale: 1.03 }, 
                    { scale: 1, duration: 0.3, ease: 'power2.out' }
                );
            }
            return;
        }

        const targetPos = order.current.indexOf(targetIndex);
        if (targetPos === -1) return;

        // Immediately notify parent about target selection
        if (onActiveIndexChangeRef.current) {
            onActiveIndexChangeRef.current(targetIndex);
        }

        // Circular rotation so targetIndex becomes 0, and relative deck order is preserved
        const newOrder = [
            ...order.current.slice(targetPos),
            ...order.current.slice(0, targetPos)
        ];

        const cardsToBack = order.current.slice(0, targetPos);
        const cardsAdvancing = order.current.slice(targetPos);

        const tl = gsap.timeline({
            onComplete: () => {
                order.current = newOrder;
                // Snap all cards to their precise mathematical slot coordinates
                newOrder.forEach((idx, i) => {
                    const el = refs[idx]?.current;
                    if (el) {
                        const slot = makeSlot(i, cardDistance, verticalDistance, total);
                        placeNow(el, slot, skewAmount);
                    }
                });
                tlRef.current = null;
            }
        });
        tlRef.current = tl;

        // 1. Target card smoothly glides to front slot (0)
        const targetEl = refs[targetIndex]?.current;
        const slot0 = makeSlot(0, cardDistance, verticalDistance, total);
        if (targetEl) {
            tl.set(targetEl, { zIndex: total + 10 }, 0);
            tl.to(targetEl, {
                x: slot0.x,
                y: slot0.y,
                z: slot0.z,
                scale: slot0.scale,
                opacity: 1,
                duration: 0.52,
                ease: 'power3.out'
            }, 0);
        }

        // 2. Other advancing cards glide forward to their new slots (EQUAL TIMING)
        cardsAdvancing.forEach((idx) => {
            if (idx === targetIndex) return;
            const el = refs[idx]?.current;
            if (!el) return;
            const newPos = newOrder.indexOf(idx);
            const slot = makeSlot(newPos, cardDistance, verticalDistance, total);

            tl.set(el, { zIndex: slot.zIndex }, 0);
            tl.to(el, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                scale: slot.scale,
                opacity: slot.opacity,
                duration: 0.52,
                ease: 'power3.out'
            }, 0);
        });

        // 3. Cards moving to the back dip down gently, swap zIndex, and rise into their back slots
        cardsToBack.forEach((idx) => {
            const el = refs[idx]?.current;
            if (!el) return;
            const newPos = newOrder.indexOf(idx);
            const slot = makeSlot(newPos, cardDistance, verticalDistance, total);

            // Dip down slightly to avoid intersecting forward-moving cards
            tl.to(el, {
                y: '+=160',
                opacity: 0.2,
                duration: 0.24,
                ease: 'power2.in'
            }, 0);

            // Re-assign to back zIndex
            tl.set(el, {
                zIndex: slot.zIndex,
                x: slot.x,
                z: slot.z
            }, 0.24);

            // Rise smoothly into back slot
            tl.to(el, {
                y: slot.y,
                opacity: slot.opacity,
                scale: slot.scale,
                duration: 0.32,
                ease: 'power3.out'
            }, 0.24);
        });
    };

    useImperativeHandle(ref, () => ({
        swap: swapNext,
        next: swapNext,
        prev: swapPrev,
        goTo: (idx) => goTo(idx),
        getActiveIndex: () => order.current[0],
        getTotal: () => order.current.length
    }));

    // Initial placement on mount or when children change
    useEffect(() => {
        const total = refs.length;
        order.current = Array.from({ length: total }, (_, i) => i);

        refs.forEach((r, i) => {
            if (r.current) {
                placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
            }
        });

        resetInterval();

        if (pauseOnHover && container.current) {
            const node = container.current;
            const pause = () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
            const resume = () => {
                resetInterval();
            };
            node.addEventListener('mouseenter', pause);
            node.addEventListener('mouseleave', resume);
            return () => {
                node.removeEventListener('mouseenter', pause);
                node.removeEventListener('mouseleave', resume);
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, refs.length]);

    const rendered = childArr.map((child, i) =>
        isValidElement(child)
            ? cloneElement(child, {
                key: i,
                ref: refs[i],
                style: { width, height, ...(child.props.style ?? {}) },
                onClick: (e) => {
                    child.props.onClick?.(e);
                    if (onCardClick) onCardClick(i);
                    // If front card is clicked, cycle to next; if back card is clicked, bring that card forward!
                    if (order.current[0] === i) {
                        swapNext();
                    } else {
                        goTo(i);
                    }
                }
            })
            : child
    );

    // Mobile Touch Gesture Support (Swipe left/right to cycle cards)
    const touchStartPos = useRef({ x: 0, y: 0, time: 0 });

    const handleTouchStart = (e) => {
        if (!e.touches || e.touches.length === 0) return;
        touchStartPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now()
        };
    };

    const handleTouchEnd = (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const deltaX = e.changedTouches[0].clientX - touchStartPos.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartPos.current.y;
        const deltaTime = Date.now() - touchStartPos.current.time;

        // Quick horizontal swipe gesture
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1 && deltaTime < 600) {
            if (deltaX < 0) {
                swapNext();
            } else {
                swapPrev();
            }
        }
    };

    return (
        <div
            ref={container}
            className="card-swap-container"
            style={{ width, height }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="card-swap-stage">
                {rendered}
            </div>
        </div>
    );
});

CardSwap.displayName = 'CardSwap';
export default CardSwap;
