"use client"
import {SupportedLanguages,translations} from '../../constants/translations'
import styles from './Modal.module.css'
import { useEffect } from 'react'

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    language: SupportedLanguages; // Recebe o idioma como propriedade
}

export default function ConfirmationModal({ message, onConfirm, onCancel, language }: ConfirmationModalProps) {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onCancel(); // Fecha o modal ao clicar fora
        }
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [onCancel])

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
            <div className={styles.modal}>
                <h2 id="confirm-title" className="sr-only">{translations[language].confirm}</h2>
                <p id="confirm-desc">{message}</p>
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={onConfirm} className={styles.confirmButton}>
                        {translations[language].confirm}
                    </button>
                    <button type="button" onClick={onCancel} className={styles.cancelButton}>
                        {translations[language].cancel}
                    </button>
                </div>
            </div>
        </div>
    );
}
