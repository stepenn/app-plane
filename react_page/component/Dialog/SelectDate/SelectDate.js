
import React, { PropTypes } from 'react';
import DatePicker from './DatePicker.js';

import css from './time.css';


function ModalDatePicker(props) {
    function onModalClose(event) {
        if (event.target === event.currentTarget) {
            props.onCancel();
        }
    }
    return (

        <div>
            <div
                style={{ display: props.isOpen ? '' : 'none' }}
                onClick={onModalClose}
                className={css.datepicker_modal}>
                <DatePicker {...props}  />
            </div>
        </div>
    );
}

// class ModalDatePicker extends React.Com{
//
//     render(){
//         return (
//             <Modal {...props}>
//                 <EnhanceDatePicker />
//             </Modal>
//         );
//     }
// }

ModalDatePicker.propTypes = {
    isOpen: PropTypes.bool,
    theme: PropTypes.string,
    value: PropTypes.object,
    min: PropTypes.object,
    max: PropTypes.object,
    dateFormat: PropTypes.array,
    headFormat: PropTypes.string,
    onSelect: PropTypes.func,
    onCancel: PropTypes.func,
};

ModalDatePicker.defaultProps = {
    isOpen: false,
    theme: 'default',
    value: new Date(),
    min: new Date(1900, 0, 1),
    max: new Date(2038, 0, 1),
    dateFormat: ['YYYY年', 'M月', 'D日','h点','m分'],
    headFormat:'default',
    onSelect: (data,str) => {},
    onCancel: () => {},
};

export default ModalDatePicker;
