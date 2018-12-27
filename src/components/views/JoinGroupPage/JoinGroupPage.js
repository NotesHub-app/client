import React from 'react';
import { connect } from 'react-redux';
import { Intent } from '@blueprintjs/core';
import { joinGroupUrlParamsSelector } from '../../../redux/selectors';
import { joinGroup } from '../../../redux/modules/data/actions';
import history from '../../../history';

export class JoinGroupPage extends React.Component {
    async componentDidMount() {
        const { code, groupId, joinGroup } = this.props;
        try {
            await joinGroup(groupId, code);
            window.showToast({ message: 'Успешно присединились к группе!', intent: Intent.SUCCESS, icon: 'unlock' });
        } catch (e) {
            console.warn(e);
            window.showToast({ message: 'Не удалось присоединиться к группе!', intent: Intent.DANGER, icon: 'lock' });
        } finally {
            history.push('/notes');
        }
    }

    render() {
        return <div>Пытаемся присоединиться к группе...</div>;
    }
}

function mapStateToProps(state, ownProps) {
    const joinGroupUrlParams = joinGroupUrlParamsSelector(window.location.href);
    return {
        ...joinGroupUrlParams,
        ...ownProps.match.params,
    };
}

export default connect(
    mapStateToProps,
    {
        joinGroup,
    },
)(JoinGroupPage);
