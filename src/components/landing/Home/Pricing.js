import { collection, getDoc, getDocs, query } from "firebase/firestore";
import React, { Component, useEffect, useState } from "react";
import { db, doc } from "../../../firebase"; 

const Pricing = () => {
  const [temp, setTemp] = useState([]);

  useEffect(() => {
    getTemplates();
  }, [])


  const getTemplates = async () => {
    const ary = [];
    const q = query(collection(db, "Templates"));
    const querySnapshot = await getDocs(q); 
    querySnapshot.forEach((data)=>{ 
     ary.push(data.data())
    })
    setTemp(ary);
  };
 

  return (
    <section className="pricing-one" id="pricing">
      <div className="container">
        <div className="block-title text-center">
          <h2 className="block-title__title">
            <span>Easy To Use</span>
          </h2>
          {/* <div className="cta-one__text"> */}
          <p className="banner-one__text">
            Easy to customise and use from a wide range of predesigned templates of Certificates and Badges.
          </p>
          {/* </div> */}
        </div>

        <div className="tabed-content">
          <div id="month">

            <div className="row pricing-one__price-row">
              {
             temp &&   temp.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="col-lg-4 animated fadeInUp"
                      data-wow-duration="1500ms"
                    >
                      {
                        i < 3 && <img src={e.preview} height="auto" width="100%"/>
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
