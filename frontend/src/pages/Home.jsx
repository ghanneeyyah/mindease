import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import ChatPage from "../components/ChatPage";

const Home = () => {
    return (
        <div className="flex h-screen">
            <SideBar />

            {/* Main Content Area */}
            <div className="flex flex-col ml-64 w-full">
                <NavBar />
                
                {/* Chat Area */}
                <div className="flex-1 bg-neutral-900 text-gray-200 overflow-hidden">
                    <ChatPage />
                </div>
            </div>
        </div>
    );
};

export default Home;
