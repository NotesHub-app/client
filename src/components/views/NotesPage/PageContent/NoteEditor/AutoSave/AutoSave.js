import React from 'react';
import { FormSpy } from 'react-final-form';
import { formValuesDiff } from '../../../../../../utils/helpers';

class AutoSave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: props.values,
            submitting: false,
            timeout: null,
            save: async () => {
                if (this.promise) {
                    await this.promise;
                }
                const { values, save, dirty } = this.props;

                if (!dirty) {
                    return;
                }

                const difference = formValuesDiff(this.state.values, values);

                if (Object.keys(difference).length) {
                    // Если что-то поменялось
                    this.setState({ submitting: true, values });
                    this.promise = save(difference);
                    await this.promise;
                    delete this.promise;
                    this.setState({ submitting: false });
                }
            },
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.timeout) {
            clearTimeout(prevState.timeout);
        }

        if (prevState.active && !nextProps.active) {
            // Какое-то поле потеряло фокус
            prevState.save();
            return {};
        }

        return { timeout: setTimeout(prevState.save, nextProps.debounce), active: nextProps.active };
    }

    componentWillUnmount() {
        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }
    }

    render() {
        return null;
    }
}

const AutoSaveSpy = props => (
    <FormSpy {...props} subscription={{ active: true, values: true, dirty: true }} component={AutoSave} />
);
export default AutoSaveSpy;
