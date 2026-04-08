import { ProjectCard } from './ProjectCard'

export function ProjectGrid({ projects }: { projects: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      {projects.map((project, index) => {
        const isWide = index % 2 === 0
        const rowIndex = Math.floor(index / 2) + 1
        const narrowOnLeft = Math.floor(index / 2) % 2 === 0
        
        let gridClass = 'grid-item'
        const style: React.CSSProperties = { animationDelay: `${index * 0.1}s` }
        
        if (isWide) {
          gridClass += ' lg:col-span-2'
          style.gridRow = rowIndex
          if (narrowOnLeft) {
            style.gridColumn = '2 / 4'
          }
        } else {
          style.gridRow = rowIndex
          if (!narrowOnLeft) {
            style.gridColumn = '3'
          }
        }
        
        return (
          <div
            key={project.id}
            className={gridClass}
            style={style}
          >
            <ProjectCard project={project} isWide={isWide} />
          </div>
        )
      })}
    </div>
  )
}