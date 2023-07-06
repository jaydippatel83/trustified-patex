import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore'; 
import { db } from '../../firebase';  

const Preview = () => {
    const [data, setdata] = useState();

    const getTemplates = async () => {
        const array = [];
        const q = query(collection(db, "Templates"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setdata(doc.data());
            array.push(doc.data());
        })
        setdata(array);
    }

    useEffect(() => {
        getTemplates();
    }, [])

    useEffect(() => {
        data && data.map((d) => { 
            let newPosition = { x: 0, y: 0 };
            newPosition.x = d.name.position.x * d.width / d.width;
            newPosition.y = d.name.position.y * d.height / d.height; 
            d.name.position = newPosition;

            
        })
    }, [data])

    return (
        <div className='container mt-5 mb-5'>
            <div className='row'>
                <p>Templates</p>
                {
                    data && data.map((e, i) => { 
                        return (
                            <div id="temp1" key={i} className='col-12 mt-5 mb-5'>
                                {/* <CertificateTemplate data={e}/> */}
                                <div  style={{position:'relative', width:e.width, height:e.height}}>
                                    <img src={e.bgImage} width={e.width} height={e.height} />
                                    <div style={e.title.style}>{e.title.text}</div>
                                    <div style={e.subTitle.style}>{e.subTitle.text}</div>
                                    <div style={e.certName.style}>{e.certName.text}</div>
                                    <div style={e.name.style}>{e.name.text}</div>
                                    <div style={e.description.style}>{e.description.text}</div>
                                    <div style={e.date.style}>{e.date.text}</div>
                                    <img src={e.logo.img}  style={e.logo.style} width="100" />
                                    <img src={e.sign.img}  style={e.sign.style} width="100" />
                                </div>
                            </div>
                        )
                    })
                }  
            </div>
        </div>
    );
};

export default Preview;