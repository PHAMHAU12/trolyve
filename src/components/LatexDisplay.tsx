import React from 'react';
import katex from 'katex';

interface LatexDisplayProps {
  content: string;
  className?: string;
}

export const LatexDisplay: React.FC<LatexDisplayProps> = ({ content, className = '' }) => {
  // Parse inline $...$ and block $$...$$ or \begin{...}...\end{...}
  const renderMathText = (rawText: string) => {
    if (!rawText) return null;

    // Split by $$...$$ or $...$
    const parts: React.ReactNode[] = [];
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$|\\begin\{[\s\S]*?\\end\{[a-zA-Z*]+\})/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(rawText)) !== null) {
      const matchIndex = match.index;
      const matchedString = match[0];

      // Push text before match
      if (matchIndex > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {rawText.slice(lastIndex, matchIndex)}
          </span>
        );
      }

      // Check if display mode ($$ or \begin) or inline ($)
      const isBlock = matchedString.startsWith('$$') || matchedString.startsWith('\\begin');
      let mathCode = matchedString;

      if (matchedString.startsWith('$$') && matchedString.endsWith('$$')) {
        mathCode = matchedString.slice(2, -2).trim();
      } else if (matchedString.startsWith('$') && matchedString.endsWith('$')) {
        mathCode = matchedString.slice(1, -1).trim();
      }

      try {
        const html = katex.renderToString(mathCode, {
          displayMode: isBlock,
          throwOnError: false,
        });

        parts.push(
          <span
            key={`math-${matchIndex}`}
            className={isBlock ? 'block my-3 text-center overflow-x-auto py-1' : 'inline-block px-1'}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        parts.push(
          <code key={`err-${matchIndex}`} className="text-amber-500 font-mono text-xs">
            {matchedString}
          </code>
        );
      }

      lastIndex = matchIndex + matchedString.length;
    }

    // Push remaining text
    if (lastIndex < rawText.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{rawText.slice(lastIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <div className={`leading-relaxed whitespace-pre-wrap break-words ${className}`}>
      {renderMathText(content)}
    </div>
  );
};
