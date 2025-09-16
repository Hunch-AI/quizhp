'use client';

import React from 'react';

type Control = {
    type?: string;
    keys?: string[];
    description?: string;
};

type KeyboardKeyProps = {
    keyName: string;
    size?: 'small' | 'normal' | 'large';
};

const KeyboardKey = ({ keyName, size = 'normal' }: KeyboardKeyProps) => {
    const sizeStyles = {
        small: { padding: '3px 6px', minWidth: '20px', fontSize: '11px' },
        normal: { padding: '4px 8px', minWidth: '28px', fontSize: '13px' },
        large: { padding: '6px 12px', minWidth: '40px', fontSize: '14px' }
    };

    const style = sizeStyles[size];

    return (
        <kbd
            className="inline-flex items-center justify-center font-mono rounded shadow-sm"
            style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                padding: style.padding,
                minWidth: style.minWidth,
                fontSize: style.fontSize,
                height: 'auto',
                lineHeight: '1.2'
            }}
        >
            {keyName}
        </kbd>
    );
};

type ControlsProps = {
    controls: Control[];
};

export default function Controls({ controls }: ControlsProps) {
    const parsedControls: Control[] = React.useMemo(() => {
        if (Array.isArray(controls)) return controls as Control[];
        if (typeof controls === 'string') {
            try {
                const v = JSON.parse(controls);
                return Array.isArray(v) ? (v as Control[]) : [];
            } catch {
                return [];
            }
        }
        return [];
    }, [controls]);

    if (parsedControls.length === 0) {
        return (
            <div className="card" style={{ padding: 16, flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Controls</div>
                <p style={{ fontSize: 14, opacity: 0.85, margin: 0, color: 'var(--muted)' }}>
                    —
                </p>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: 16, flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: 'var(--ink)' }}>Controls</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {parsedControls.map((control, i) => (
                    <div key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', minWidth: '80px' }}>
                                {control.keys && control.keys.length > 0 ? (
                                    control.keys.map((key, keyIndex) => (
                                        <KeyboardKey
                                            key={keyIndex}
                                            keyName={key}
                                            size={key.length > 3 ? 'large' : 'normal'}
                                        />
                                    ))
                                ) : control.type ? (
                                    <KeyboardKey keyName={control.type} size="normal" />
                                ) : (
                                    <span style={{ color: 'var(--muted)', fontSize: 14 }}>—</span>
                                )}
                            </div>
                            <span style={{
                                color: 'var(--ink)',
                                fontSize: 14,
                                opacity: 0.85,
                                flex: 1
                            }}>
                                {control.description || '—'}
                            </span>
                        </div>
                        {i < parsedControls.length - 1 && (
                            <div style={{
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)',
                                margin: '4px 0',
                                opacity: 0.6
                            }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
