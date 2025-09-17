import React from 'react';
import PropTypes from 'prop-types';
import Input from '@/reusable/Input';

const DateRange = ({
    fromLabel = 'Date from',
    toLabel = 'Date to',
    from,
    to,
    onChangeFrom,
    onChangeTo,
    className = '',
    minFrom,
    maxFrom,
    minTo,
    maxTo,
}) => {
    return (
        <div className={className}>
            <Input
                label={fromLabel}
                type="date"
                value={from}
                onChange={onChangeFrom}
                className={''}
                min={minFrom}
                max={typeof maxFrom !== 'undefined' ? maxFrom : (to || undefined)}
            />
            <Input
                label={toLabel}
                type="date"
                value={to}
                onChange={onChangeTo}
                className={''}
                min={typeof minTo !== 'undefined' ? minTo : (from || undefined)}
                max={maxTo}
            />
        </div>
    );
};

DateRange.propTypes = {
    fromLabel: PropTypes.string,
    toLabel: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    onChangeFrom: PropTypes.func,
    onChangeTo: PropTypes.func,
    className: PropTypes.string,
    minFrom: PropTypes.string,
    maxFrom: PropTypes.string,
    minTo: PropTypes.string,
    maxTo: PropTypes.string,
};

export default DateRange;


