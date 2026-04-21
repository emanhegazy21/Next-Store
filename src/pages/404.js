import ErrorComponent from '@/components/ErrorComponent';
import React from 'react';

const index = () => {
    return (
        <div>
            <ErrorComponent/>
        </div>
    );
};

export default index;
index.getLayout = function(page){
    return <>{page}</>
}