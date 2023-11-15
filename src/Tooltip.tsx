import React from 'react';
import { MessageType } from './common/interfaces';

interface ITooltipProps {
    type: MessageType;
    message: string;
}

const Tooltip: React.FC<ITooltipProps> = (props: ITooltipProps): JSX.Element => {

    return (
        <div className={`tooltip ${props.type}`}>
            {props.message}
        </div>
    );
};

export default Tooltip;
