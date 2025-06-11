import { useEffect, useState, useRef } from 'react';

const useScroll = (ref: React.RefObject<HTMLDivElement>) => {
  const [isBottom, setIsBottom] = useState(false);

  const handleScroll = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      setIsBottom(scrollTop + clientHeight >= scrollHeight);
    }
  };

  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref]);

  return isBottom;
};

export default useScroll;
