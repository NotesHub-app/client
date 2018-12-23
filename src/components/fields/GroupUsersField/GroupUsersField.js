import React from 'react';
import { Table, Column } from 'react-vt-table';
import SizeMe from '@avinlab/react-size-me';
import classNames from 'classnames';
import { Button, Intent } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import SelectField from '../SelectField';
import styles from './styles.module.scss';

class RoleSelector extends React.Component {
    render() {
        const { value, onChange, disabled } = this.props;
        return (
            <SelectField
                input={{ value, onChange }}
                options={[
                    { value: 0, label: 'Администратор' },
                    { value: 1, label: 'Редактор' },
                    { value: 2, label: 'Только чтение' },
                ]}
                disabled={disabled}
                className={styles.roleSelect}
                portalClassName={styles.roleSelectPortal}
                buttonClassName="bp3-small"
            />
        );
    }
}

export default class GroupUsersField extends React.Component {
    static propTypes = {
        // ID текущего пользователя системы (он всегда задизаблен на форме)
        userId: PropTypes.string,
    };

    handleChangeValue = (field, id, value) => {
        const {
            input: { value: values, onChange },
        } = this.props;

        const resultValues = [...values];
        const itemIndex = resultValues.findIndex(i => i.id === id);
        resultValues[itemIndex] = {
            ...resultValues[itemIndex],
            [field]: value,
        };

        onChange(resultValues);
    };

    renderUserDescription(rowData) {
        let description;

        if (rowData.email) {
            description = rowData.email;
        } else if (rowData.githubUrl) {
            description = (
                <a href={rowData.githubUrl} target="_blank" rel="noopener noreferrer">
                    {rowData.githubUrl}
                </a>
            );
        } else if (rowData.googleUrl) {
            description = (
                <a href={rowData.googleUrl} target="_blank" rel="noopener noreferrer">
                    {rowData.googleUrl}
                </a>
            );
        }

        if (description) {
            return <span className={styles.userDescription}>({description})</span>;
        }
        return null;
    }

    render() {
        const {
            input: { value: values },
            userId,
        } = this.props;

        if (!values) {
            return null;
        }

        return (
            <div
                className="bp3-card bp3-elevation-0 no-padding"
                style={{ height: Math.min(35 * Math.max(values.length, 5), 300) }}
            >
                <SizeMe>
                    {({ width, height }) => (
                        <Table
                            className={styles.table}
                            width={width}
                            height={height}
                            data={values}
                            rowHeight={35}
                            noItemsLabel="Нет других пользователей"
                            dynamicColumnWidth={true}
                            overflowWidth={8}
                        >
                            <Column
                                label="Адрес"
                                dataKey="email"
                                cellRenderer={({ dataKey, rowData }) => (
                                    <div className={classNames('VTCellContent')}>
                                        <div className={classNames({ [styles.removedUser]: rowData.deleted })}>
                                            <span style={{ fontWeight: userId === rowData.id ? 'bold' : undefined }}>
                                                {rowData.userName}
                                            </span>
                                            {this.renderUserDescription(rowData)}
                                        </div>
                                    </div>
                                )}
                            />
                            <Column
                                label="Роль"
                                dataKey="role"
                                width={150}
                                cellRenderer={({ dataKey, rowData }) => (
                                    <div className={classNames('VTCellContent', styles.roleCell)}>
                                        <RoleSelector
                                            value={rowData.role}
                                            onChange={val => this.handleChangeValue('role', rowData.id, val)}
                                            disabled={userId === rowData.id}
                                        />
                                    </div>
                                )}
                            />
                            <Column
                                label=""
                                dataKey="id"
                                width={40}
                                cellRenderer={({ dataKey, rowData }) => (
                                    <div className={classNames('VTCellContent')}>
                                        {rowData.deleted ? (
                                            <Button
                                                small
                                                minimal
                                                icon="redo"
                                                intent={Intent.PRIMARY}
                                                title="Отменить удаеление пользователя"
                                                onClick={() => this.handleChangeValue('deleted', rowData.id, false)}
                                            />
                                        ) : (
                                            <Button
                                                small
                                                minimal
                                                icon="trash"
                                                title="Удалить пользователя из группы"
                                                intent={Intent.DANGER}
                                                disabled={userId === rowData.id}
                                                onClick={() => this.handleChangeValue('deleted', rowData.id, true)}
                                            />
                                        )}
                                    </div>
                                )}
                            />
                        </Table>
                    )}
                </SizeMe>
            </div>
        );
    }
}
