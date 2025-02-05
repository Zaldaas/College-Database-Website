import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | College Database`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useDocumentTitle; 