"use client";
import { useState, useEffect } from "react";
import UpgradeModal from "./UpgradeModal";

export default function GlobalModals() {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  useEffect(() => {
    const handleUpgradeModal = () => setIsUpgradeOpen(true);
    window.addEventListener("show-upgrade-modal", handleUpgradeModal);
    return () => window.removeEventListener("show-upgrade-modal", handleUpgradeModal);
  }, []);

  return <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />;
}
