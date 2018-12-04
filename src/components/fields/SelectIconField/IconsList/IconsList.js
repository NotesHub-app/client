import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { Icon } from '@blueprintjs/core';
import toLower from 'lodash/toLower';
import PropTypes from 'prop-types';
import icons from '../../../../constants/icons';
import styles from './styles.module.scss';

class Row extends React.PureComponent {
    render() {
        const { data, index, style } = this.props;

        const { items, handleSelectItem } = data;
        const item = items[index];

        return (
            <div className={styles.row} onClick={() => handleSelectItem(item)} style={style}>
                <Icon className={styles.icon} icon={item.iconName} /> {item.displayName}
            </div>
        );
    }
}

export default class IconsList extends React.Component {
    static propTypes = {
        onSelect: PropTypes.func.isRequired,
        filter: PropTypes.string.isRequired,
    };

    handleSelectItem = ({ iconName }) => {
        const { onSelect } = this.props;
        onSelect(iconName);
    };

    render() {
        let { filter } = this.props;
        const items = [];

        filter = toLower(filter);

        icons.forEach(icon => {
            if (toLower(icon.displayName).indexOf(filter) > -1 || toLower(icon.tags).indexOf(filter) > -1) {
                items.push(icon);
            }
        });
        const itemData = { items, handleSelectItem: this.handleSelectItem };

        return (
            <List height={250} itemCount={items.length} itemData={itemData} itemSize={30} width={190}>
                {Row}
            </List>
        );
    }
}
