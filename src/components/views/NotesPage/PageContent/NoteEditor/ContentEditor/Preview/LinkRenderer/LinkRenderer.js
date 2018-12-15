import React from 'react';
import { Link } from 'react-router-dom';

export default class LinkRenderer extends React.PureComponent {
    render() {
        const { href, children } = this.props;

        if (href.startsWith('note://')) {
            const convertedHref = href.replace('note://', './');
            return <Link to={convertedHref}>{children}</Link>;
        }

        return <a href={href}>{children}</a>;
    }
}
