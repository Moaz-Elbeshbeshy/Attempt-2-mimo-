import React from "react";
import { Link } from "wouter";
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-bold ml-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">تعلم العربية</h3>
            </div>
            <p className="text-gray-400 mb-6">
              نجعل تعلم اللغة العربية ممتعًا وسهلًا للأطفال من خلال ألعاب تفاعلية مبتكرة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <YoutubeIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <div className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                    الرئيسية
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/games">
                  <div className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                    الألعاب
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/subscription">
                  <div className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                    الاشتراك
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <div className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                    الملف الشخصي
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Discover */}
          <div>
            <h4 className="text-lg font-bold mb-4">اكتشف</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  المدونة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  من نحن
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  فريق العمل
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  الشروط والأحكام
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MailIcon className="h-5 w-5 text-gray-400 ml-2 mt-1" />
                <span className="text-gray-400">info@taalamarabic.com</span>
              </li>
              <li className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-400 ml-2 mt-1" />
                <span className="text-gray-400">+966 12 345 6789</span>
              </li>
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 ml-2 mt-1" />
                <span className="text-gray-400">
                  الرياض، المملكة العربية السعودية
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} تعلم العربية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
