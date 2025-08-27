"use client"
import React, { useEffect } from 'react'
import {SupportedLanguages,translations} from '../../constants/translations'
import styles from './Modal.module.css'
interface ModalProps {
    message: React.ReactNode; // Permite qualquer tipo de conteúdo, incluindo HTML
    onClose: () => void;
    language: SupportedLanguages; // Recebe o idioma como propriedade
}

export default function Modal({ message, onClose, language }: ModalProps) {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose(); // Fecha o modal ao clicar fora
        }
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [onClose])

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
            <div className={styles.modal}>
                <h2 id="modal-title" className="sr-only">{translations[language].close}</h2>
                <p id="modal-desc">{message}</p>
                <button type="button" onClick={onClose} className={styles.closeButton}>
                    {translations[language].close}
                </button>
            </div>
        </div>
    );
}
