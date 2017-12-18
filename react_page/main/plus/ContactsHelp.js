/**
 * Created by lixifeng on 17/5/25.
 */
module.exports = {
    getList(successBack,errorBack){
        if(!window.plus){
            errorBack({ code: -1, message: "请在APP中打开" });
            return;
        }

        var data = [];
        this.getPHONE(()=>{
            if(successBack){
                successBack(data);
            }
        },data);

    },
    getPHONE(successBack,data){
        plus.contacts.getAddressBook( plus.contacts.ADDRESSBOOK_PHONE, ( addressbook )=> {

            this.getListData(addressbook,()=>{
                //成功.进行下一步
                this.getSIM(successBack,data);
            },()=>{
                this.getSIM(successBack,data);
            },data);

        },  ( e ) =>{
            this.getSIM(successBack,data);
        } );
    },
    getSIM(successBack,data){
        plus.contacts.getAddressBook( plus.contacts.ADDRESSBOOK_SIM, ( addressbook )=> {
            this.getListData(addressbook,()=>{
                //成功.进行下一步
                successBack(data);
            },()=>{
                successBack(data);
            },data);
        },  ( e ) =>{
            successBack(data);
        } );
    },

    getListData(addressbook,successBack,errorBack,data){
        // 可通过addressbook进行通讯录操作
        // alert("开始读取列表");
        // alert(addressbook.find);
        addressbook.find(null,(contacts)=>{
            for(let i in contacts){
                let obj = contacts[i];
                if(obj.phoneNumbers){
                    var pn = [];
                    for(let v in obj.phoneNumbers){
                        var ContactField = obj.phoneNumbers[v];
                        pn.push(ContactField.value)
                    }
                }
            
                let index = this.isHas(data,obj.displayName);
                if(index>=0){
                    //添加手机号,到现有数组
                    this.addPhone(data[index],pn);
                }else{
                    data.push({name:obj.displayName,phones:pn});
                }
            }
            successBack();
        },  (e)=> {
            alert("读取列表错误");
            // errorBack("读取列表错误");
        },{multiple:true});
    }
    ,
    addPhone(obj,phones){
        for(let i in phones){
            if(!obj.phones){
                obj.phones = [];
            }
            if(!this.eq(obj.phones,phones[i])){
                obj.phones.push(phones[i]);
            }
        }
    },
    eq(phones,v){
        for(let i in phones){
           if( phones[i] == v){
               return true;
           }
        }
        return false;
    },
    isHas(data,name){
        for(let i in data){
            var o = data[i];
            if(o.name == name){
                //添加到
                return i;
            }
        }
        return -1;
    }
}
