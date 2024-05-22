import React from "react";
import { ReactSVG } from "react-svg";

import listCover from "../../assets/main/listCover.png";
import PlusIcon from "../../assets/main/plusIcon.svg";

export default function KategorieList(){
    return(
        <div className="listBox">
            {/* listBox */}
            <ul>
                {/* 1 */}
                <li><a href="">
                    <div className="imgBox">
                        {/* 이미지 아니면 백그라운드로 넣기 */}
                        <img src={listCover} alt=""/>
                    </div>
                    <div className="detailBox">
                        <ul>
                            {/* titleName */}
                            <li className="titleName itemTitleFont"><p>
                                유키 구라모토 콘서트(제목)유키 구라모토 콘서트(제목)
                            </p></li>
                            {/* /titleName */}
                            {/* place */}
                            <li className="place itemPlaceFont"><p>
                                서울시 예술의전당 (장소)서울시 예술의전당 (장소)
                            </p></li>
                            {/* /place */}
                            {/* data */}
                            <li><p className="itemDateFont">
                                2024.04.01 ~ 2024.10.30
                            </p></li>
                            {/* /data */}
                        </ul>
                    </div>
                </a></li>
                {/* /1 */}
                {/* 2 */}
                <li><a href="">
                    <div className="imgBox">
                        {/* 이미지 아니면 백그라운드로 넣기 */}
                        <img src={listCover} alt=""/>
                    </div>
                    <div className="detailBox">
                        <ul>
                            {/* titleName */}
                            <li className="titleName itemTitleFont"><p>
                                유키 구라모토 콘서트(제목)
                            </p></li>
                            {/* /titleName */}
                            {/* place */}
                            <li className="place itemPlaceFont"><p>
                                서울시 예술의전당 (장소)
                            </p></li>
                            {/* /place */}
                            {/* data */}
                            <li><p className="itemDateFont">
                                2024.04.01 ~ 2024.10.30
                            </p></li>
                            {/* /data */}
                        </ul>
                    </div>
                </a></li>
                {/* /2 */}
                {/* 3 */}
                <li><a href="">
                    <div className="imgBox">
                        {/* 이미지 아니면 백그라운드로 넣기 */}
                        <img src={listCover} alt=""/>
                    </div>
                    <div className="detailBox">
                        <ul>
                            {/* titleName */}
                            <li className="titleName itemTitleFont"><p>
                                유키 구라모토 콘서트(제목)
                            </p></li>
                            {/* /titleName */}
                            {/* place */}
                            <li className="place itemPlaceFont"><p>
                                서울시 예술의전당 (장소)
                            </p></li>
                            {/* /place */}
                            {/* data */}
                            <li><p className="itemDateFont">
                                2024.04.01 ~ 2024.10.30
                            </p></li>
                            {/* /data */}
                        </ul>
                    </div>
                </a></li>
                {/* /3 */}
                {/* 4 */}
                <li><a href="">
                    <div className="imgBox">
                        {/* 이미지 아니면 백그라운드로 넣기 */}
                        <img src={listCover} alt=""/>
                    </div>
                    <div className="detailBox">
                        <ul>
                            {/* titleName */}
                            <li className="titleName itemTitleFont"><p>
                                유키 구라모토 콘서트(제목)
                            </p></li>
                            {/* /titleName */}
                            {/* place */}
                            <li className="place itemPlaceFont"><p>
                                서울시 예술의전당 (장소)
                            </p></li>
                            {/* /place */}
                            {/* data */}
                            <li><p className="itemDateFont">
                                2024.04.01 ~ 2024.10.30
                            </p></li>
                            {/* /data */}
                        </ul>
                    </div>
                </a></li>
                {/* /4 */}
                {/* 5 */}
                <li><a href="">
                    <div className="imgBox">
                        {/* 이미지 아니면 백그라운드로 넣기 */}
                        <img src={listCover} alt=""/>
                    </div>
                    <div className="detailBox">
                        <ul>
                            {/* titleName */}
                            <li className="titleName itemTitleFont"><p>
                                유키 구라모토 콘서트(제목)
                            </p></li>
                            {/* /titleName */}
                            {/* place */}
                            <li className="place itemPlaceFont"><p>
                                서울시 예술의전당 (장소)
                            </p></li>
                            {/* /place */}
                            {/* data */}
                            <li><p className="itemDateFont">
                                2024.04.01 ~ 2024.10.30
                            </p></li>
                            {/* /data */}
                        </ul>
                    </div>
                </a></li>
                {/* /5 */}
            </ul>
            {/* /listBox */}
            {/* detailBox */}
            <div className="detailBoxBtn"><a href="#">
                자세히보기
                <span className="detailIcon">
                    <ReactSVG src={PlusIcon} />
                </span>
            </a></div>
            {/* /detailBox */}
        </div>
    );
}