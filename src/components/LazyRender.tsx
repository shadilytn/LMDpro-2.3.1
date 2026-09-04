import React from "react";

interface LazyRenderProps {
  children: React.ReactNode;
  height?: string;
}

export const LazyRender: React.FC<LazyRenderProps> = ({ children, height = "200px" }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isVisible) {
    return <>{children}</>;
  }

  return <div ref={containerRef} style={{ minHeight: height }} />;
};
