import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

//source https://www.npmjs.com/package/react-truncate#integrated-example-for-toggling-read-more-text

class ReadMore extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            expanded: false,
            truncated: false
        };

        this.handleTruncate = this.handleTruncate.bind(this);
        this.toggleLines = this.toggleLines.bind(this);
    }

    handleTruncate(truncated) {
        if (this.state.truncated !== truncated) {
            this.setState({
                truncated
            });
        }
    }

    toggleLines(event) {
        event.preventDefault();

        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        const {
            children,
            more,
            less,
            lines
        } = this.props;

        const {
            expanded,
            truncated
        } = this.state;
        return (
            <div>
                <Truncate
                    lines={!expanded && lines}
                    ellipsis={(
                        <span>… <button type="button" class="btn btn-outline-secondary btn-sm" onClick={this.toggleLines}>{more}</button></span>
                    )}
                    onTruncate={this.handleTruncate}
                >
                    {children}
                </Truncate>
                {!truncated && expanded && (
                    <span> <button type="button" class="btn btn-outline-secondary" onClick={this.toggleLines}>{less}</button></span>
                )}
            </div>
        );
    }
}

ReadMore.defaultProps = {
    lines: 3,
    more: 'expand',
    less: 'collapse'
};

ReadMore.propTypes = {
    children: PropTypes.node.isRequired,
    lines: PropTypes.number,
    less: PropTypes.string,
    more: PropTypes.string
};

export default ReadMore;