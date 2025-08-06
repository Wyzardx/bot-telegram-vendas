import { Card } from '../components/ui/Card'
import { Github, Globe, Mail, MessageCircle, Code, Award, Calendar, Users } from 'lucide-react'
import { DeveloperInfo } from '../types'

const developerInfo: DeveloperInfo = {
  name: 'João Silva',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
  bio: 'Desenvolvedor Full Stack especializado em bots Discord e sistemas web. Apaixonado por criar soluções inovadoras e experiências incríveis para comunidades online.',
  skills: [
    'JavaScript/TypeScript',
    'React/Next.js',
    'Node.js',
    'Discord.js',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'AWS/Cloud',
    'Docker',
    'Git/GitHub'
  ],
  social_links: {
    github: 'https://github.com/joaosilva',
    discord: 'JoãoSilva#1234',
    website: 'https://joaosilva.dev',
    email: 'contato@joaosilva.dev'
  },
  projects_count: 47,
  experience_years: 5
}

const achievements = [
  {
    title: 'Bot Discord Mais Popular',
    description: 'Criou um bot que serve mais de 100k usuários',
    icon: Award,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    title: 'Desenvolvedor Certificado',
    description: 'Certificações em AWS e Google Cloud',
    icon: Code,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Comunidade Ativa',
    description: 'Contribui regularmente para projetos open source',
    icon: Users,
    color: 'from-green-500 to-green-600'
  },
  {
    title: '5 Anos de Experiência',
    description: 'Desenvolvendo soluções web e bots desde 2019',
    icon: Calendar,
    color: 'from-purple-500 to-purple-600'
  }
]

const recentProjects = [
  {
    name: 'EconomyBot Pro',
    description: 'Sistema completo de economia para Discord com loja, ranking e mini-games',
    tech: ['Discord.js', 'Node.js', 'PostgreSQL'],
    users: '50k+'
  },
  {
    name: 'ModeratorAI',
    description: 'Bot de moderação inteligente com detecção automática de spam e toxicidade',
    tech: ['Python', 'TensorFlow', 'Discord.py'],
    users: '25k+'
  },
  {
    name: 'MusicBot Ultimate',
    description: 'Bot de música avançado com suporte a múltiplas plataformas',
    tech: ['JavaScript', 'FFmpeg', 'YouTube API'],
    users: '75k+'
  }
]

export function Developer() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Developer Info</h1>
        <p className="text-white/60">Conheça o desenvolvedor por trás deste sistema</p>
      </div>

      {/* Developer Profile */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10"></div>
        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={developerInfo.avatar}
              alt={developerInfo.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{developerInfo.name}</h2>
              <p className="text-white/80 mb-4 leading-relaxed">{developerInfo.bio}</p>
              <div className="flex flex-wrap gap-2">
                {developerInfo.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{developerInfo.projects_count}</p>
              <p className="text-white/60 text-sm">Projetos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{developerInfo.experience_years}</p>
              <p className="text-white/60 text-sm">Anos de Experiência</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">200k+</p>
              <p className="text-white/60 text-sm">Usuários Atendidos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-white/60 text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Links */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Contato & Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href={developerInfo.social_links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <Github className="w-6 h-6 text-white/70 group-hover:text-white" />
            <div>
              <p className="font-medium text-white">GitHub</p>
              <p className="text-sm text-white/60">Ver repositórios</p>
            </div>
          </a>

          <a
            href={developerInfo.social_links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <Globe className="w-6 h-6 text-white/70 group-hover:text-white" />
            <div>
              <p className="font-medium text-white">Website</p>
              <p className="text-sm text-white/60">Portfólio online</p>
            </div>
          </a>

          <a
            href={`mailto:${developerInfo.social_links.email}`}
            className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <Mail className="w-6 h-6 text-white/70 group-hover:text-white" />
            <div>
              <p className="font-medium text-white">Email</p>
              <p className="text-sm text-white/60">Contato direto</p>
            </div>
          </a>

          <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
            <MessageCircle className="w-6 h-6 text-white/70" />
            <div>
              <p className="font-medium text-white">Discord</p>
              <p className="text-sm text-white/60">{developerInfo.social_links.discord}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Conquistas & Certificações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center`}>
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{achievement.title}</h4>
                <p className="text-sm text-white/60">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Projects */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Projetos Recentes</h3>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div
              key={project.name}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{project.name}</h4>
                <span className="text-sm text-primary-400 font-medium">{project.users} usuários</span>
              </div>
              <p className="text-white/70 text-sm mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Precisa de um Bot Personalizado?</h3>
        <p className="text-white/70 mb-4">
          Entre em contato para desenvolver uma solução única para sua comunidade Discord
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`mailto:${developerInfo.social_links.email}`}
            className="btn-primary"
          >
            <Mail className="w-4 h-4 mr-2" />
            Solicitar Orçamento
          </a>
          <a
            href={developerInfo.social_links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Globe className="w-4 h-4 mr-2" />
            Ver Portfólio
          </a>
        </div>
      </Card>
    </div>
  )
}