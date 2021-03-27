
import React  from 'react';

function NF() {

  return (
    <div>
      <br/><br/>
        <div className="flex flex-wrap container mx-auto">
            <span className="mx-auto text-6xl tracking-widest font-black text-red-600">404</span>
        </div>
        <div className="flex flex-wrap container mx-auto items-center justify-between">
            <div className="mx-auto text-2xl p-8 text-red-400"> Page is not available. </div>
        </div>
        <div className="flex flex-wrap container mx-auto items-center justify-between">
            <div className="mx-auto text-xl text-green-500"> But we are. </div>
        </div>
        <div className="flex flex-wrap container mx-auto items-center justify-between">
            <div className="mx-auto text-sm text-blue-600"> Feel free to share any suggestion, complaint, feedback, thoughts.</div>
        </div>
    </div>
  );
}

export default NF;
