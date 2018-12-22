import React from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import config from '../../../../config';

export default class AlternativeLogin extends React.Component {
    render() {
        const services = [];

        if (config.serverConfiguration.googleAuth) {
            services.push({
                service: 'google',
                title: 'Google',
            });
        }

        if (config.serverConfiguration.githubAuth) {
            services.push({
                service: 'github',
                title: 'GitHub',
            });
        }

        return (
            <div>
                <div className="text-muted" style={{ marginTop: 20 }}>
                    &mdash; или войти через &mdash;
                </div>
                <div className={styles.externalAuthServices}>
                    {services.map(({ service, title }) => (
                        <a key={service} href={`${config.apiUrl}/auth/google`} className="item">
                            <img
                                src={`/static/icons/${service}.svg`}
                                alt={service}
                                className={classNames(styles.icon)}
                            />
                            <br />
                            {title}
                        </a>
                    ))}
                </div>
            </div>
        );
    }
}
