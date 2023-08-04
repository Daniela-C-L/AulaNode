import React from "react";

function Container({children}) {
    return (
        <main className='container'>
            {children}
        </main>
    )
}

export default Container