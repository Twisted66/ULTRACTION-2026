import { useEffect, useState } from 'react';

interface Props {
  words?: string;
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export default function TextTypeAnimation({
  words = '',
  className = '',
  typingSpeed = 120,
  deletingSpeed = 40,
  pauseDuration = 1500,
}: Props) {
  // Parse words from string (Astro passes as string attribute)
  const wordList = typeof words === 'string' ? words.split(',') : words;

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = wordList[currentWordIndex] || '';
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing in
      if (text.length < word.length) {
        timeout = setTimeout(() => {
          setText(word.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, wait then start deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % wordList.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentWordIndex, wordList, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {text}
      <span
        animate={{ opacity: isDeleting ? [1, 0] : [1, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        className="inline-block ml-1"
      >
        |
      </span>
    </span>
  );
}
