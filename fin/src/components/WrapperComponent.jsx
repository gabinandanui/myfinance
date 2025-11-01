import React from 'react'

const WrapperComponent = ({children, wrapperClass}) => {
  return (
    <div className={wrapperClass? wrapperClass : 'flex'}>
      {children}
    </div>
  )
}

export default WrapperComponent