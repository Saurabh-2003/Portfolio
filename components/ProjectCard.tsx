import {Roboto, Inter, Space_Mono} from 'next/font/google'

const roboto = Roboto({
  weight:'700',
  subsets:['vietnamese'],
  display:'swap'
})

const space = Space_Mono({
  weight:'400',
  subsets:['latin']
})

const inter = Inter({
  weight:'400',
  subsets:['latin-ext'],
})


interface ProjectCardProps {
  image: string;
  link: string;
  topicName: string;
  description: string;
  tech:string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, link, topicName, description, tech}) => {
  return (
    <div className=' mb-4 flex  flex-wrap items-center justify-center'>
      <div className='w-[310px] h-[320px] flex flex-col overflow-hidden
          flex-wrap bg-white/30 rounded-lg dark:bg-gradient-to-r to-violet-100 from-blue-100 '>
        <img className='h-[170px] w-full object-fill' src={image} alt={topicName} />
        <a
        href={link}
        className={`text-xl text-transparent bg-gradient-to-tr bg-clip-text 
        from-blue-600 to-violet-600 text-center capitalize ${roboto.className}`}
      >
          {topicName}
        </a>

       <div className='px-2 text-[13px]'>
          <p className={`text-slate-500 ${space.className}`}>{description}</p>
          <p className='text-slate-600  font-medium font-mono'>
            <span className=' font-semibold'>Tech Stack :</span>
            {tech}</p>
       </div>
    </div>
    </div>
  );
};

export default ProjectCard;
