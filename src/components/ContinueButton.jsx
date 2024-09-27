import React from 'react'

const ContinueButton = ({setClick}) => {
  return (
    <button className='px-10 py-3 bg-orange-600 text-white rounded-lg font-semibold text-md mt-10 mb-2' onClick={()=>setClick((prev)=>!prev)}>
        Continue
    </button>
  )
}

export default ContinueButton
