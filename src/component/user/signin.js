import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import link from "../../link/user";
import L from "leaflet";

export default function Signin() {
  const navigate = useNavigate();
  const pincode = require("pincode-lat-long");
  console.log(pincode.getlatlong(250001).lat);

  const [name, setName] = useState("");
  const [zone, setZone] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [pindata, setPindata] = useState([]);
  const [position, setPosition] = useState([29.018865, 77.768095]); //map
  const Mob = (e) => {
    if (e.length <= 10) setPhone(e);
  };
  const PIN = (e) => {
    if (e.length <= 6) setPin(e);
    if (e.length === 6) detail(e);
    else {
      setPindata([
        
      ]);
      setZone("");
    }
  };
  const detail = async (e) => {
    const response = await fetch("https://api.postalpincode.in/pincode/" + e);
    const data = await response.json();
    if (data[0].Status === "Success") {
      setPindata(data[0].PostOffice);
      setPosition([
        pincode.getlatlong(250001).lat,
        pincode.getlatlong(250001).lat,
      ]);
      console.log(position)
    } else {
      setZone("");
      setPindata([]);
      alert("Enter valid Pincode");
    }
  };

  function done() {
    if (
      phone.length === 10 &&
      password.length >= 8 &&
      name.length >= 2 &&
      pin.length === 6 &&
      zone.length >= 1
    ) {
      let a = link.create({
        name: name,
        phone: phone,
        password: password,
        pincode: pin,
        zone: zone,
      });
      console.log("dsf" + a.success);
    } else {
      alert("Enter Valid details");
    }
  }
  // map==================
  useEffect(() => {
    var map = L.map("map").setView(position, 10);
    //for different view we can go https://leaflet-extras.github.io/leaflet-providers/preview/
    var googleStreets = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );
    googleStreets.addTo(map);
    if(!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation feature!")
    } else {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(getPosition)
        }, 1000);
    }

    var marker, circle;

    function getPosition(position){
        // console.log(position)
        var lat = position.coords.latitude
        var long = position.coords.longitude
        var accuracy = position.coords.accuracy

        if(marker) {
            map.removeLayer(marker)
        }

        if(circle) {
            map.removeLayer(circle)
        }

        marker = L.marker([lat, long])
        circle = L.circle([lat, long], {radius: accuracy})

        var featureGroup = L.featureGroup([marker, circle]).addTo(map)

        map.fitBounds(featureGroup.getBounds())

        console.log("Your coordinate is: Lat: "+ lat +" Long: "+ long+ " Accuracy: "+ accuracy)
      }
  }, []);
  
  // return===============
  return (
    <>
      <div className="box center">
        <div className="heading1">Sign in</div>
        <input
          type="number"
          placeholder="Mobile number"
          value={phone}
          onChange={(e) => Mob(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Pincode"
          value={pin}
          onChange={(e) => PIN(e.target.value)}
        />
        <label>Select your Area:</label>
        <select value={zone} onChange={(e) => setZone(e.target.value)}>
          {pindata.map((e,i) => {
            return (
                <option key={i}>{e.Name}</option>
            );
          })}
        </select>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={done}>Signin </button>
        <p onClick={() => navigate("/user")} className="link">
          Already have an account | click here |
        </p>
      </div>
      <div id="map" style={{ height: "70vh" }}></div>
    </>
  );
}
