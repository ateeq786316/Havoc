/**
 * Utility function to scroll to the top of the page
 * @param behavior - Scroll behavior ('smooth' or 'auto')
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior,
  });
};

/**
 * Hook to scroll to top when route changes
 */
export const useScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return scrollToTop;
};
