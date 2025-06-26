import React from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: React.FC<TextareaProps> = ({ className = '', ...rest }) => {
  return (
    <textarea className={styles.textarea + (className ? ' ' + className : '')} {...rest} />
  );
};

export default Textarea; 