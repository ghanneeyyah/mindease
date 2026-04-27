import { Link } from "react-router-dom";
const SideBar =()=>{
    return(
        <div className="flex flex-col fixed top-0 left-0 bg-neutral-900 w-64 h-screen justify-between text-gray-200 p-8 z-20">
            {/* head */}
            <div className="space-y-8">
                <div className="">
                    <h2 className="text-2xl font-mono">TermiChat</h2>
                </div>
                <div className="space-y-2">
                    <h3>
                        <i class="fas fa-comment-alt"></i>
                        New Chat
                    </h3>
                    <hr className="text-slate-400"/>
                </div>
            </div>

            {/* history */}
            <div>
                
            </div>
            
            <hr className="text-slate-400"/>

            {/* footer */}
            <div className="border-red-500">
                <Link to="/login">
                    <h3>
                    <i className="fas fa-sign-out-alt"></i>
                    Log Out</h3>
                </Link>
            </div>
        </div>
    );
};

export default SideBar