import React from 'react';
import Image from 'next/image';

const Contact = () => {
  const contactInfo = [
    {
      id: 1,
      type: 'email',
      value: 'contact@jeremie-m.dev',
      icon: '/images/contact/mail.svg',
      link: 'mailto:contact@jeremie-m.dev',
    },
    {
      id: 2,
      type: 'discord',
      value: 'wpzputre',
      icon: '/images/contact/discord.svg',
      link: 'https://discord.com/users/wpzputre',
    },
    {
      id: 3,
      type: 'twitter',
      value: '@__Putre__',
      icon: '/images/contact/x.svg',
      link: 'https://twitter.com/__Putre__',
    },
    {
      id: 4,
      type: 'github',
      value: 'github.com/jeremie-m',
      icon: '/images/contact/github-logo.svg',
      link: 'https://github.com/jeremie-m',
    },
  ];

  return (
    <section id="contact" className="flex flex-col justify-between items-center self-stretch h-[270px] px-5">
      <h2 className="font-medium text-[24px] font-montserrat leading-[16px] text-center text-white mb-8">
        Contact
      </h2>
      
      <div className="w-full flex flex-col gap-4">
        {contactInfo.map((item) => (
          <a 
            key={item.id} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-between items-center w-full"
          >
            <Image src={item.icon} alt={item.type} width={40} height={40} />
            <span className={`text-[14px] leading-[16px] font-montserrat text-right text-white`}>
              {item.value}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact; 