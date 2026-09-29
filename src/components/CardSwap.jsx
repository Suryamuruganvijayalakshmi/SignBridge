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

const makeSlot = (i, distX, distY, total) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i
});

const placeNow = (el, slot, skew) =>
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
    });

export const CardSwap = forwardRef(({
    width = 420,
    height = 500,
    cardDistance = 45,
    verticalDistance = 40,
    delay = 4500,
    pauseOnHover = true,
    onCardClick,
    onActiveIndexChange,
    skewAmount = 5,
    easing = 'elastic',
    children
}, ref) => {
    const config =
        easing === 'elastic'
            ? {
                ease: 'elastic.out(0.6,0.9)',
                durDrop: 1.8,
                durMove: 1.8,
                durReturn: 1.8,
                promoteOverlap: 0.9,
                returnDelay: 0.05
            }
            : {
                ease: 'power1.inOut',
                durDrop: 0.8,
                durMove: 0.8,
                durReturn: 0.8,
                promoteOverlap: 0.45,
                returnDelay: 0.2
            };

    const childArr = useMemo(() => Children.toArray(children), [children]);
    const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);
    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const tlRef = useRef(null);
    const intervalRef = useRef(0);
    const container = useRef(null);

    const swap = (targetIndex = null) => {
        if (order.current.length < 2) return;
        if (tlRef.current && tlRef.current.isActive()) return;

        const currentFront = order.current[0];
        
        if (targetIndex !== null && currentFront === targetIndex) return;

        let rest;
        if (targetIndex !== null) {
            const remaining = order.current.filter(x => x !== currentFront && x !== targetIndex);
            rest = [targetIndex, ...remaining];
        } else {
            rest = order.current.slice(1);
        }

        const elFront = refs[currentFront]?.current;
        if (!elFront) return;

        if (onActiveIndexChange) {
            onActiveIndexChange(rest[0]);
        }

        const tl = gsap.timeline({
            onComplete: () => {
                order.current = [...rest, currentFront];
            }
        });
        tlRef.current = tl;

        tl.to(elFront, {
            y: '+=500',
            duration: config.durDrop,
            ease: config.ease
        });

        tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
        rest.forEach((idx, i) => {
            const el = refs[idx]?.current;
            if (!el) return;
            const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
            tl.set(el, { zIndex: slot.zIndex }, 'promote');
            tl.to(
                el,
                {
                    x: slot.x,
                    y: slot.y,
                    z: slot.z,
                    duration: config.durMove,
                    ease: config.ease
                },
                `promote+=${i * 0.15}`
            );
        });

        const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
        tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
        tl.call(
            () => {
                gsap.set(elFront, { zIndex: backSlot.zIndex });
            },
            undefined,
            'return'
        );

        tl.to(
            elFront,
            {
                x: backSlot.x,
                y: backSlot.y,
                z: backSlot.z,
                duration: config.durReturn,
                ease: config.ease
            },
            'return'
        );
    };

    useImperativeHandle(ref, () => ({
        swap,
        goTo: (idx) => swap(idx),
        getActiveIndex: () => order.current[0],
        getTotal: () => order.current.length
    }));

    useEffect(() => {
        const total = refs.length;
        refs.forEach((r, i) => {
            if (r.current) {
                placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
            }
        });

        if (delay > 0) {
            intervalRef.current = window.setInterval(swap, delay);
        }

        if (pauseOnHover && container.current) {
            const node = container.current;
            const pause = () => {
                tlRef.current?.pause();
                clearInterval(intervalRef.current);
            };
            const resume = () => {
                tlRef.current?.play();
                if (delay > 0) {
                    intervalRef.current = window.setInterval(swap, delay);
                }
            };
            node.addEventListener('mouseenter', pause);
            node.addEventListener('mouseleave', resume);
            return () => {
                node.removeEventListener('mouseenter', pause);
                node.removeEventListener('mouseleave', resume);
                clearInterval(intervalRef.current);
            };
        }

        return () => clearInterval(intervalRef.current);
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs]);

    const rendered = childArr.map((child, i) =>
        isValidElement(child)
            ? cloneElement(child, {
                key: i,
                ref: refs[i],
                style: { width, height, ...(child.props.style ?? {}) },
                onClick: (e) => {
                    child.props.onClick?.(e);
                    if (onCardClick) onCardClick(i);
                    swap();
                }
            })
            : child
    );

    return (
        <div
            ref={container}
            className="card-swap-container"
            style={{ width, height }}
        >
            <div className="card-swap-stage">
                {rendered}
            </div>
        </div>
    );
});

CardSwap.displayName = 'CardSwap';
export default CardSwap;
