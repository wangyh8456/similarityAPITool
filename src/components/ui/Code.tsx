'use client'

import { FC, useState, useEffect } from 'react'
import { type Language, themes, Highlight } from 'prism-react-renderer'
import { useTheme } from 'next-themes'
const { nightOwl, nightOwlLight } = themes;

interface CodeProps {
    code: string
    show: boolean
    language: Language
    animationDelay?: number
    animated?: boolean
}

const Code: FC<CodeProps> = ({ code, show, language, animated, animationDelay }) => {
    const { theme: applicationTheme } = useTheme();
    const [text, setText] = useState(animated ? '' : code);
    useEffect(() => {
        if (show && animated) {
            let i = 0;
            setTimeout(() => {
                const intervalId = setInterval(() => {
                    setText(code.slice(0, i));
                    i++;
                    if (i > code.length) {
                        clearInterval(intervalId);
                    }
                    return () => clearInterval(intervalId);//返回的函数作为卸载时的清理函数
                }, 15);
            }, animationDelay || 150)
        }
    }, [code, show, animated, animationDelay])

    const lines = text.split(/\r\n|\r|\n/).length
    const theme = applicationTheme === 'dark' ? nightOwl : nightOwlLight

    return <Highlight code={text} language={language} theme={theme}>
        {({ className, tokens, getLineProps, getTokenProps }) => <pre
            className={className + ' transition-all w-fit bg-transparent duration-100 py-0 no-scrollbar'}
            style={{ maxHeight: show ? lines * 24 : 0, opacity: show ? 1 : 0 }}
        >
            {tokens.map((line, i) => {
                const { key, ...rest } = getLineProps({ line });

                return (
                    <div key={`line-${i}`} style={{ position: 'relative' }} {...rest}>
                        {line.map((token, index) => {
                            const { key, ...props } = getTokenProps({ token });
                            return <span key={index} {...props} />
                        })}
                    </div>
                )
            })}
        </pre>}
    </Highlight>
}

export default Code