import React from 'react';

export default function DisciplinesMarquee() {
    const items = [
        'AI', 'SOFTWARE', 'WEB', 'CLOUD', 'IoT', 'EDGE AI', 'AUTOMATION', 'INNOVATION',
        'COMPUTER VISION', 'TINYML', 'EMBEDDED', 'REST APIS', 'SPATIAL COMPUTE'
    ];

    return (
        <section className="marquee-section" aria-label="Technology disciplines">
            <div className="marquee-track-wrap">
                <div className="marquee-track">
                    {items.concat(items).map((item, index) => (
                        <React.Fragment key={`${item}-${index}`}>
                            <span className="marquee-item">{item}</span>
                            <span className="marquee-star">✳</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
