import {SupportedLanguages,translations} from '../../constants/translations'
import styles from './Modal.module.css'
interface ModalProps {
    message: string;
    onClose: () => void;
    language: SupportedLanguages; // Recebe o idioma como propriedade
}

export default function Modal({ message, onClose, language }: ModalProps) {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose(); // Fecha o modal ao clicar fora
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <p>{message}</p>
                <button onClick={onClose} className={styles.closeButton}>
                    {translations[language].close}
                </button>
            </div>
        </div>
    );
}
