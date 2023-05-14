import style from './card.module.scss';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Checkbox } from 'primereact/checkbox';
import { ProgressBar } from 'primereact/progressbar';

import CardSidebar from '@/components/card/CardSidebar';


export default function Card() {

  return (
    <>
      <div 
        className="
          flex 
          justify-center
          overflow-x-hidden
          overflow-y-auto
          fixed
          inset-0
          z-50
          outline-none
          focus:outline-none
          bg-neutral-800/70
        "
      >
        <div 
          className="
            relative
            w-full
            md:w-[768px]
            my-12
            mx-auto
            min-h-[913px]
          "
        >
          {/* content */}
          <div 
            className="
              flex
              flex-col
              w-full
              min-h-full
              px-3
              py-4
            bg-white
              shadow-lg
              rounded-lg
            "
          >
            {/* header */}
            <div 
              className="
                relative
                flex
                items-start
            ">
              <div className="grow">
                <div>
                  在列表 
                  <span className="pl-1 underline decoration-1 cursor-pointer">
                    代辦事項 <i className="pi pi-angle-down"></i>
                  </span>
                </div>

                <InputText  placeholder="卡片標題"
                  className="
                    w-full
                    my-2
                    mr-10
                  "
                />
              </div>

              <button className="pl-10">
                <i className="pi pi-times" ></i>
              </button>

            </div>

            {/* body  */}

            <div 
              className="
                grow
                flex
                gap-2
              "
            >
              {/* main col */}
              <div 
                className={`
                  ${style.card_main_col}
                  grow
                `}
              >
                {/* card detail list*/}
                <div className="
                  flex
                  flex-wrap
                  gap-2
                ">
                  {/* priority */}
                  <div className={`
                    ${style.detail_item_wrapper}
                  `}>
                    <i className="pi pi-flag-fill" 
                      style={{ color: '#5C7878' }}
                    >
                    </i>
                  </div>

                  {/* member */}
                  <div className={`
                    ${style.detail_item_wrapper}
                  `}>
                    <div 
                     className={`${style.member}`}>
                      <div className={`${style.name}`}>
                        Na
                      </div>
                    </div>
                    <div 
                      className={`${style.member}`}>
                      <div className={`${style.name}`}>
                        Na
                      </div>
                    </div>

                    <button className={`${style.detail_item_btn}`}>
                      <i className="pi pi-plus" 
                        style={{ color: '#ffffff' }}
                      ></i>
                    </button>
                  </div>

                   {/* tags */}
                  <div className={`
                    ${style.detail_item_wrapper}
                  `}>
                    <div 
                      className="
                        px-6
                        py-1
                       bg-slate-500
                        rounded-md
                    ">
                      <span className="text-sm text-white">Tag 001</span>
                    </div>

                    <div 
                      className="
                        px-6
                        py-1
                       bg-slate-500
                        rounded-md
                    ">
                      <span className="text-sm text-white">Tag 002</span>
                    </div>
                    <div 
                      className="
                        px-6
                        py-1
                       bg-slate-500
                        rounded-md
                    ">
                      <span className="text-sm text-white">Tag 002</span>
                    </div>
                   
                    {/* <Button icon="pi pi-plus" rounded aria-label="Plus" /> */}
                    <button className={`${style.detail_item_btn}`}>
                      <i className="pi pi-plus" 
                        style={{ color: '#ffffff' }}
                      ></i>
                    </button>

                  </div>

                  {/* due date */}
                  <div className={`
                    ${style.detail_item_wrapper}
                  `}>
                    <div>
                      <Checkbox onChange={e => {}} checked={true}></Checkbox>
                      <span className="px-2"> 3/20 - 6/18 18:00</span>
                      <i className="pi pi-angle-down" 
                        style={{ color: '#ffffff' }}
                      ></i>
                    </div>
                  
                  </div>
                </div>
                
                {/* description */}
                <div>
                  <InputTextarea  rows={5} cols={30} placeholder="描述"
                    className="w-full"
                  />
                </div>

                {/* attachment */}
                <div>
                  <h4 className="mb-3 text-lg">附件</h4>
                  <div 
                    className="
                      mb-3
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div 
                      className="
                        w-[140px]
                        h-[90px]
                      bg-slate-300
                      "
                    ></div>
                    <div className="grow">
                      <div 
                        className="
                          text-lg
                        "
                      >
                        Image.jpg
                      </div>
                      <div className="text-sm text-slate-500">
                        上傳於 2023/03/30 14:20
                      </div>
                    </div>
                    <button>
                      <i className="pi pi-trash"></i>
                    </button>
                  </div>

                  <FileUpload mode="basic" chooseLabel="增加附件" name="attachment[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={()=>{}} />
                </div>

                {/* todo list */}
                <div>
                  <div 
                    className="
                      flex
                      items-center
                    "
                  >
                    <h5 className="grow">待辦事項標題</h5>
                    <div>
                      <Button label="隱藏完成項目" size="small" className="mx-1"/>
                      <Button label="刪除" size="small" className="mx-1"/>
                    </div>

                  </div>
                  <ProgressBar value={50} className='mt-2 mb-4'></ProgressBar>
                  <ul>
                    <li className="flex items-center gap-3 mb-3">
                      <Checkbox onChange={e => {}} checked={true}></Checkbox>
                      <p className="text-slate-400 line-through">User story</p>
                    </li>
                    <li className="flex items-center gap-3 mb-3">
                      <Checkbox onChange={e => {}} checked={false}></Checkbox>
                      <p className="">User story</p>
                    </li>
                  </ul>
                </div>

                {/* comment */}
                <div 
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                   <div 
                     className={`${style.member}`}>
                      <div className={`${style.name}`}>
                        Na
                      </div>
                    </div>
                    <InputText onChange={(e) => {}} 
                      className="w-full"
                      placeholder="撰寫評論"
                    />
                </div>
              </div>

              {/* sidebar */}
              <div 
                className="
                  hidden
                  md:block
                  w-[192px]
                "
              >
                <CardSidebar />
              </div>

            </div>
            
          </div>
        </div>
      </div>
    </>
  )
}
