import { motion } from 'framer-motion';
import { type ElementType, type HTMLAttributes, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

interface VariableSpeedConfig {
  min: number;
  max: number;
}

interface TextTypeAnimationProps {
  text?: string | string[];
  words?: string;
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | ReactNode;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: VariableSpeedConfig;
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

export default function TextTypeAnimation({
  text,
  words,
  as: Component = 'span',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...rest
}: TextTypeAnimationProps & HTMLAttributes<HTMLElement>) {
  const resolvedText = text ?? words ?? '';
  const textArray = useMemo(() => {
    if (Array.isArray(resolvedText)) {
      return resolvedText;
    }

    return String(resolvedText)
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }, [resolvedText]);

  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(!startOnVisible);
  const [delayElapsed, setDelayElapsed] = useState(initialDelay <= 0);
  const containerRef = useRef<HTMLElement | null>(null);

  const getRandomSpeed = () => {
    if (!variableSpeed) {
      return typingSpeed;
    }

    return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
  };

  const getCurrentTextColor = () => {
    if (textColors.length === 0) {
      return 'inherit';
    }

    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasEnteredViewport(true);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!hasEnteredViewport || delayElapsed) {
      return;
    }

    const timeout = setTimeout(() => {
      setDelayElapsed(true);
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, [hasEnteredViewport, delayElapsed, initialDelay]);

  useEffect(() => {
    if (!hasEnteredViewport || !delayElapsed || textArray.length === 0) {
      return;
    }

    const sentence = textArray[currentTextIndex] ?? '';
    const currentText = reverseMode ? sentence.split('').reverse().join('') : sentence;
    const isLastSentence = currentTextIndex === textArray.length - 1;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (isDeleting) {
      if (typedText.length === 0) {
        setIsDeleting(false);
        if (onSentenceComplete) {
          onSentenceComplete(sentence, currentTextIndex);
        }

        if (!loop && isLastSentence) {
          return;
        }

        setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
        setCharIndex(0);
      } else {
        timeout = setTimeout(() => {
          setTypedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else if (charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setTypedText((prev) => prev + currentText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, getRandomSpeed());
    } else {
      if (!loop && isLastSentence) {
        return;
      }

      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    hasEnteredViewport,
    delayElapsed,
    textArray,
    currentTextIndex,
    charIndex,
    isDeleting,
    typedText,
    reverseMode,
    deletingSpeed,
    pauseDuration,
    loop,
    onSentenceComplete,
    variableSpeed,
    typingSpeed,
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping &&
    textArray.length > 0 &&
    (charIndex < (textArray[currentTextIndex]?.length ?? 0) || isDeleting);

  return (
    <Component
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap tracking-tight ${className}`.trim()}
      {...rest}
    >
      <span className="inline" style={{ color: getCurrentTextColor() }}>
        {typedText}
      </span>
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: cursorBlinkDuration,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
          className={`ml-1 inline-block ${shouldHideCursor ? 'opacity-0' : 'opacity-100'} ${cursorClassName}`.trim()}
          aria-hidden="true"
        >
          {cursorCharacter}
        </motion.span>
      )}
    </Component>
  );
}
