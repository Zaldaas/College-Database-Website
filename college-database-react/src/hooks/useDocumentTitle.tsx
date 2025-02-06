import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | College Database`;
  }, [title]);
};

export default useDocumentTitle; 