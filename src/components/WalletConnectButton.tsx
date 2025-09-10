"use client";

import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface WalletConnectButtonProps {
  onConnect?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function WalletConnectButton({ onConnect, disabled, className, children }: WalletConnectButtonProps) {
  return (
    <Button
      onClick={onConnect}
      disabled={disabled}
      className={className}
      variant="gradient"
    >
      {children || (
        <>
          Connect Wallet
          <Wallet className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
}
