import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
// 引入 utils
import { API_URL } from "../../utils/config";
// 引入 component
import SwitchBTN from "./SwitchBTN";
// 引入樣式 icon
import "./PetData.scss";
import { BsFunnel } from "react-icons/bs";
// 引入圖表元件
import DetailChart from "./DetailChart";

function AddPetData(props) {
    // 取得當前 selected pet id (來自 match params)
    const selectedPetId = parseInt(props.match.params.selectedPet, 10);
    // 被選取毛孩
    const [selectedPet, setSelectedPet] = useState(selectedPetId);
    // 按鈕狀態 (true 體重 / false 身長)
    const [switchBTN, setSwitchBTN] = useState(false);
    // 身高體重 (height / weight)
    // const [hwSwitch, setHwSwitch] = useState("height");
    // 毛孩列表
    const [petList, setPetList] = useState([]);
    // 存取身長/體重資料狀態
    const [petHWInfo, setPetHWInfo] = useState([]);
    // const petHeightRef = useRef(); 想用但失敗
    // const petWeightRef = useRef();
    // 資料編輯狀態
    const [edit, setEdit] = useState();
    const [editData, setEditData] = useState({value:"", time:""});
    // 錯誤提示
    const [editErr, setEditErr] = useState({
        value:"",
        time:"",
    });


    // 切換按鈕狀態函式
    const toggleSwitchBTN = () => {
        setSwitchBTN(!switchBTN);
    };

    // 取得毛孩 id & name
    useEffect(() => {
        let getPetInfo = async () => {
        try {
            // 先取得已登入使用者所有毛孩列表
            let listResult = await axios.get(`${API_URL}/pet`, {withCredentials: true,});
            console.log(listResult.data.data);
            let newPetList = [...petList];
            newPetList = listResult.data.data.map((v, i) => [v.id, v.name]);
            // console.log(newPetList);
            // 將所有毛孩 id 依序存入陣列
            setPetList(newPetList);
            // 第一次渲染先取得初始毛孩的原始資料 (好像不用這段?)
            // let heightResult = await axios.get(`${API_URL}/pet/height/${selectedPet}`,
            //     {withCredentials: true,});
            // petHeightRef.current = heightResult.data.data;
            // let weightResult = await axios.get(`${API_URL}/pet/weight/${selectedPet}`, 
            //     {withCredentials: true});
            // petWeightRef.current = weightResult.data.data;
            
        
        } catch(e) {
            console.error("pet data 錯誤", e.response.data);
            
        }};
        getPetInfo();
    }, []);

    // 抓身高函式
    let getHeight = async () => {
        try {
            let heightResult = await axios.get(`${API_URL}/pet/height/${selectedPet}`, {withCredentials: true});
            // console.log(heightResult.data);
            // 用 Ref 只有剛開始有用, 後面還是會跟著 petHWInfo 跑??
            // petHeightRef.current = heightResult.data.data; 
            setPetHWInfo([...heightResult.data.data]);
        } catch(e) {
            console.error("all height 錯誤", e.response.data);
        }};
    
    // 抓體重函式
    let getWeight = async () => {
        try {
            let weightResult = await axios.get(`${API_URL}/pet/weight/${selectedPet}`, {withCredentials: true});
            // console.log(weightResult.data);
            // petWeightRef.current = weightResult.data.data;
            setPetHWInfo([...weightResult.data.data]);
        } catch(e) {
            console.error("all weight 錯誤", e.response.data);
        }};

    // 選取毛孩狀態改變時 => 取得被選取毛孩身長 or 體重資料
    useEffect(() => {
        if(selectedPet) {
            if(switchBTN === false) { 
                getHeight();
            } else if(switchBTN === true) {
                getWeight();
            }
        }
    }, [selectedPet, switchBTN]);

    // 篩選資料日期函式
    
    // 切換編輯狀態函式
    const handleEdit = (e) => {
        const btnId = e.target.name;
        console.log(btnId);
        setEdit(btnId);
    };
    const handleCancel = () => {
        setEdit();
        setEditData({value:"", time:""});
        setEditErr({ value:"", time:"", });
        if(switchBTN === false) {
            // const originalData = [...petHeightRef.current];
            // setPetHWInfo([...originalData]);
            getHeight();
        }else {
            // const originalData = [...petWeightRef.current];
            // setPetHWInfo([...originalData]);
            getWeight();
        }
    };

    // 修改 input onChange 函式
    function handleChange(e) {
        if(switchBTN === false) {
            setEditData({...editData, id:edit, petId: selectedPet, [e.target.name]:e.target.value, type:"height"});
        } else {
            setEditData({...editData, id:edit, petId: selectedPet, [e.target.name]:e.target.value, type:"weight"});
        }
        // 取得被改變的資料在 petHWInfo 陣列裡的位置 (index)
        const editId = petHWInfo.findIndex((data) => {
            return data.id === parseInt(edit)
        });
        // console.log(petHWInfo[editId]);
        let newEditData = petHWInfo[editId];
        newEditData[e.target.name] = e.target.value;
        let temPetHWInfo = [...petHWInfo];
        temPetHWInfo[editId] = newEditData;
        // 將更新的 input 資料同步更新到 petHWInfo 狀態中
        // 不然 input 的值無法跟著輸入值改變
        setPetHWInfo([...temPetHWInfo]);
        setEditErr({ ...editErr, [e.target.name]: "" });
    };

    // 確認修改函式
    async function handleSubmit(e) {
        e.preventDefault();
        if (editErr.value || editErr.time) {
            return;
        } else {
            try {
                let editResult = await axios.post(`${API_URL}/pet/editData`, editData, 
                {withCredentials:true});
                console.log(editResult.data);
                if(editResult.data.message === "ok") {
                    alert("修改成功!");
                    setEdit();
                    setEditData({value:"", time:""});
                }else if (editResult.data.message === "no data input") {
                    setEdit();
                    setEditData({value:"", time:""});
                }
            } catch(e) {
                console.error("資料更新失敗", e.response.data);
                setEditErr({ ...editErr, value: e.response.data.value, time: e.response.data.time, })
            }
        };
    }

    // 新增資料函式們
    // 顯示新增欄位
    function handleAddBtn() {
        setEdit("new");
    };
    // input onChange
    function handleAddChange(e) {
        if(switchBTN === false) {
            setEditData({...editData, petId:selectedPet, [e.target.name]:e.target.value, type:"height"});
        } else {
            setEditData({...editData, petId:selectedPet, [e.target.name]:e.target.value, type:"weight"});
        }
        setEditErr({ ...editErr, [e.target.name]: "" });
    };
    // 取消按鈕
    function handleAddCancel() {
        setEdit();
        setEditData({value:"", time:""});
        setEditErr({ value:"", time:"", });

    };
    // 確認新增按鈕
    async function handleAddConfirm(e) {
        e.preventDefault();
        if (editErr.value || editErr.time) {
            return;
        } else {
            try {
                let editResult = await axios.post(`${API_URL}/pet/addData`, editData, 
                {withCredentials:true});
                console.log(editResult.data);
                if(editResult.data.message === "ok") {
                    alert("新增成功!");
                    setEdit();
                    setEditData({value:"", time:""});
                    if(switchBTN === false) {
                        getHeight();
                    }else {
                        getWeight();
                    }
                }
            } catch(e) {
                console.error("新增失敗:", e.response.data);
                setEditErr({...editErr, value: e.response.data.value, time: e.response.data.time});
            };
        };
    };

    // 欄位前端檢查函式
    const handleValueInvalid = (e) => {
        e.preventDefault();
        if (switchBTN === false) {
            if (e.target.value > 999.9 || e.target.value < 1) {
                setEditErr({ ...editErr, [e.target.name]: "身長需介於 1~999.9 cm" });
            }
        } else if (switchBTN === true) {
            if (e.target.value > 99.9 || e.target.value < 1) {
                setEditErr({ ...editErr, [e.target.name]: "體重需介於 1~99.9 kg" });
            }
        }
      };
    const handleTimeInvalid = (e) => {
        e.preventDefault();
        const today = Date.parse(new Date());
        const inputDate = Date.parse(e.target.value);
        console.log(today, inputDate);
        if (e.target.value && inputDate > today) {
          setEditErr({ ...editErr, [e.target.name]: "請選擇早於今天的日期" });
        }
      };
 

  return (
    <div className="info-card pet-data-edit">
        <div className="row">
        <div className="col-lg-7">
            <div className="d-flex justify-content-start pet-data-select">
                <SwitchBTN type="button" active={switchBTN} clicked={toggleSwitchBTN}></SwitchBTN>
                <select 
                    name="selectedPet"
                    className="form-control"
                    value={selectedPet}
                    onChange={(e) => {
                        setSelectedPet(e.target.value)
                    }}
                >
                {petList.map((pet, i) => {
                    return (<option key={pet[0]} value={parseInt(pet[0])}>{pet[1]}</option>)
                })}                    
                </select>
                <button type="button" className="btn" onClick={handleAddBtn}>新增資料</button>
            </div>
            <form>
                <table className="table table-hover pet-data-table">
                    <thead>
                        <tr>
                            <th>{!switchBTN ? "身長 (cm)" : "體重 (kg)"}</th>
                            <th>資料時間 <BsFunnel type="button" className="sorting-icon" /> </th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {edit === "new" && (
                            <tr>
                                <td>
                                    <input 
                                        type="number"
                                        min="1.0" step="0.1" max={!switchBTN ? "999.9" : "99.9"}
                                        name="value"
                                        value={editData.value}
                                        className="form-control"
                                        onChange={(e) => {handleAddChange(e);handleValueInvalid(e)}}
                                    />
                                    <div className="errMsg">{editErr.value && editErr.value}</div>
                                </td>
                                <td>
                                    <input 
                                        type="date"
                                        name="time"
                                        value={editData.time}
                                        className="form-control"
                                        onChange={(e) => {handleAddChange(e);handleTimeInvalid(e)}} />
                                    <div className="errMsg">{editErr.time && editErr.time}</div>
                                </td>
                                <td>
                                    <div className="d-flex">
                                        <button type="button" className="btn" onClick={handleAddConfirm}>確認</button>
                                        <button type="button" className="btn" onClick={handleAddCancel}>取消</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {petHWInfo.map((data, i) => {
                            return (
                                <tr key={data.id}>
                                    <td>{edit !== data.id.toString() ? data.value : 
                                        <input 
                                            type="number"
                                            min="1.0" step="0.1" max={!switchBTN ? "999.9" : "99.9"}
                                            name="value"
                                            value={data.value}
                                            className="form-control"
                                            onChange={(e) => {handleChange(e);handleValueInvalid(e)}}
                                        />}
                                        <div className="errMsg">
                                            {editErr.value && edit === data.id.toString() ? editErr.value : ""}
                                        </div>
                                    </td>
                                    <td className="date-form">
                                        {edit !== data.id.toString() ? data.time : 
                                        <input 
                                            type="date"
                                            name="time"
                                            value={data.time}
                                            className="form-control"
                                            onChange={(e) => {handleChange(e);handleTimeInvalid(e)}}
                                        />}
                                        <div className="errMsg">
                                            {editErr.time && edit === data.id.toString() ? editErr.time : ""}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            {edit !== data.id.toString() ? (
                                                <>
                                                    <button name={data.id} type="button" className="btn" onClick={handleEdit}>修改</button>
                                                    <button type="button" className="btn">刪除</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button type="button" className="btn" onClick={handleSubmit}>確認</button>
                                                    <button type="button" className="btn" onClick={handleCancel}>取消</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </form>
        </div>
        <div className="col-lg-5">
            <DetailChart petHWInfo={petHWInfo} />
        </div>
        </div>
    </div>
  )
}


export default withRouter(AddPetData)