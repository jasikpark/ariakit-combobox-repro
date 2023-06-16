import * as AriaKit from '@ariakit/react';
import cn from 'classnames';
import { forwardRef } from 'react';
import styles from './ComboboxItem.module.css';

type Props = {
  children: React.ReactNode;
  /** Item is a static message, not selectable */
  isMessage?: boolean;
  className?: string;
} & AriaKit.ComboboxItemProps;

export const ComboboxItem = forwardRef<HTMLDivElement, Props>(({ children, isMessage, className, ...props }, ref) => {
  return (
    <AriaKit.ComboboxItem
      className={cn(styles.ComboboxItem, {
        [styles.ComboboxItem___isMessage]: isMessage,
      })}
      disabled={isMessage}
      ref={ref}
      {...props}
    >
      {/* mr-16 balances out the padding difference between left and right, to properly center. */}
      <span className={cn('truncate grow mr-16', className)}>{children}</span>
    </AriaKit.ComboboxItem>
  );
});
ComboboxItem.displayName = 'ComboboxItem';
