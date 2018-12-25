import React from 'react';
import { PropTypes } from 'prop-types';
import dayjs from 'dayjs';
import styles from './styles.module.scss';

export default class DateTimeLabel extends React.Component {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
        showDate: PropTypes.bool,
        showTime: PropTypes.bool,
        dateFormat: PropTypes.string,
        timeFormat: PropTypes.string,
    };

    static defaultProps = {
        showDate: true,
        showTime: true,
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'HH:mm:ss',
    };

    render() {
        const { value, showDate, showTime, dateFormat, timeFormat } = this.props;

        return (
            <span>
                {showDate && <span className={styles.date}>{dayjs(value).format(dateFormat)}</span>}
                {showTime && <span className={styles.time}>{dayjs(value).format(timeFormat)}</span>}
            </span>
        );
    }
}
