import React, {
  useEffect,
  useState,
} from "react";

import DesktopCart from "./DesktopCart";
import MobileCartSheet from "./MobileCartSheet";

function ResponsiveCart({
  visible,
  onClose,
}) {
  const [isMobile, setIsMobile] =
    useState(
      () => window.innerWidth < 768
    );

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 767.98px)"
    );

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, []);

  if (isMobile) {
    return (
      <MobileCartSheet
        visible={visible}
        onClose={onClose}
      />
    );
  }

  return (
    <DesktopCart
      visible={visible}
      onClose={onClose}
    />
  );
}

export default ResponsiveCart;