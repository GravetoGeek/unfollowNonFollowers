import {SupportedLanguages,translations} from '../../constants/translations'
import styles from './Modal.module.css'

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

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <p>{message}</p>
                <div className={styles.buttonGroup}>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        {translations[language].confirm}
                    </button>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        {translations[language].cancel}
                    </button>
                </div>
            </div>
        </div>
    );
}
