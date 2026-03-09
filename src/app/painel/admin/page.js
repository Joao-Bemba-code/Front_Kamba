import React from 'react';

/**
 * Componente Admin - Painel de Controle KAMBABUSINESS
 * Estruturado para Next.js (App Router)
 */
export default function AdminPage() {
    return (
        <>
            {/* Importação manual de Ícones e Fontes via CDN para garantir o visual do código original */}
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />

            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased flex min-h-screen overflow-hidden font-sans">
                
                {/* Sidebar Navigation */}
                <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-50 shadow-lg">
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-primary rounded-lg p-2 flex items-center justify-center shadow">
                            <span className="material-symbols-outlined text-white">account_balance</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-primary font-bold text-lg leading-none tracking-tight">KAMBABUSINESS</h1>
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Administração</span>
                        </div>
                    </div>
                    
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {['Painel Principal', 'Gestão de Usuários', 'Projetos Ativos', 'Segurança e Auditoria', 'Relatórios Analíticos'].map((item, index) => (
                            <a key={index} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">
                                <span className="material-symbols-outlined">{['dashboard', 'group', 'rocket_launch', 'shield_person', 'monitoring'][index]}</span>
                                <span>{item}</span>
                            </a>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 shadow">
                            <img alt="Perfil do Admin" className="size-10 rounded-full border-2 border-primary" src="https://ui-avatars.com/api/?name=Joao+Baptista&background=0D8ABC&color=fff"/>
                            <div className="flex flex-col overflow-hidden">
                                <p className="text-sm font-semibold truncate">Dr. João Baptista</p>
                                <p className="text-xs text-slate-500 truncate">Super Admin</p>
                            </div>
                            <button className="ml-auto text-slate-400 hover:text-red-500">
                                <span className="material-symbols-outlined text-xl">logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-72 p-8">
                    {/* Header Section */}
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Visão Geral do Ecossistema</h2>
                            <p className="text-slate-500">Bem-vindo de volta ao centro de operações da KAMBABUSINESS.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium shadow hover:shadow-md transition">
                                <span className="material-symbols-outlined text-lg">calendar_today</span>
                                <span>Últimos 30 Dias</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition">
                                <span className="material-symbols-outlined text-lg">download</span>
                                <span>Exportar Dados</span>
                            </button>
                        </div>
                    </header>

                    {/* Global Metrics Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { title: 'Capital Total Gerido', value: 'Kz 450.000.000', trend: '+12.5% este mês', icon: 'account_balance_wallet' },
                            { title: 'Projetos Ativos', value: '124', trend: '+5 novos hoje', icon: 'rocket' },
                            { title: 'Usuários Totais', value: '8.540', trend: '+18.4% YoY', icon: 'groups' },
                            { title: 'Saúde da Plataforma', value: '99.9%', trend: 'Sistemas Estáveis', icon: 'health_and_safety' }
                        ].map((metric, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shadow-lg">
                                <div className="flex justify-between items-start">
                                    <p className="text-slate-500 text-sm font-medium">{metric.title}</p>
                                    <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">{metric.icon}</span>
                                </div>
                                <p className="text-2xl font-bold">{metric.value}</p>
                                <p className="text-emerald-500 text-sm font-semibold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> {metric.trend}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Seção: Gestão de Utilizadores */}
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Gestão de Utilizadores</h3>
                            <div className="flex gap-2">
                                <input className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary outline-none min-w-[300px]" placeholder="Procurar usuário..." type="text"/>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Utilizador</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tipo de Conta</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Data de Registo</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {[
                                        { name: 'Ricardo Silva', email: 'ricardo.silva@kamba.com', accountType: 'Empreendedor', status: 'Ativo', registrationDate: '12 Out 2023' },
                                        { name: 'Ana Paula', email: 'ana.paula@invest.ao', accountType: 'Investidor', status: 'Ativo', registrationDate: '15 Out 2023' },
                                        { name: 'Mário Bento', email: 'mario.b@outlook.pt', accountType: 'Empreendedor', status: 'Pendente', registrationDate: '18 Out 2023' }
                                    ].map((user, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{user.name}</span>
                                                    <span className="text-xs text-slate-500">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.accountType === 'Investidor' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100 dark:bg-slate-800'}`}>{user.accountType}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Ativo' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span> {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{user.registrationDate}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-tight">Remover</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Desempenho de Projetos */}
                    <section>
                        <h3 className="text-xl font-bold mb-6">Desempenho e Probabilidade de Sucesso (IA)</h3>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { title: 'AgroAngola Digital', entrepreneur: 'Ricardo Silva', successRate: '94.2%', amountRaised: 'Kz 28.500.000', totalAmount: 'Kz 40M', daysRemaining: '14 Dias', investors: '12 Indivíduos', icon: 'agriculture' },
                                { title: 'SunLogic Huambo', entrepreneur: 'Mário Bento', successRate: '78.1%', amountRaised: 'Kz 5.000.000', totalAmount: 'Kz 15M', daysRemaining: '45 Dias', investors: '3 Indivíduos', icon: 'solar_power' }
                            ].map((project, index) => (
                                <div key={index} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        <div className="lg:w-1/3 flex flex-col gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-3xl text-primary">{project.icon}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold">{project.title}</h4>
                                                    <p className="text-sm text-slate-500">Empreendedor: <span className="text-slate-900 dark:text-slate-100 font-medium">{project.entrepreneur}</span></p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Probabilidade de Sucesso IA</span>
                                                    <span className="text-lg font-bold text-primary">{project.successRate}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-primary h-full rounded-full" style={{ width: project.successRate }}></div>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-2 italic">*Análise baseada em tração de mercado e maturidade do modelo de negócio.</p>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 flex flex-col justify-center gap-4 border-l border-slate-100 dark:border-slate-800 px-0 lg:px-8">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Montante Angariado</p>
                                                    <p className="text-xl font-bold">{project.amountRaised} <span className="text-xs text-slate-400 font-normal">de {project.totalAmount}</span></p>
                                                </div>
                                                <span className="text-sm font-bold text-primary">
                                                    {((parseFloat(project.amountRaised.replace(/[Kz .]/g, '')) / parseFloat(project.totalAmount.replace(/[Kz M]/g, '')) / 1000000 * 100) || 0).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                                                <div className="bg-gradient-to-r from-primary to-blue-400 h-full rounded-full" style={{ width: project.successRate }}></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase">Dias Restantes</p>
                                                    <p className="text-sm font-bold">{project.daysRemaining}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase">Total Investidores</p>
                                                    <p className="text-sm font-bold">{project.investors}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 border-l border-slate-100 dark:border-slate-800 px-0 lg:px-8">
                                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">Investidores Recentes</h5>
                                            <div className="space-y-3">
                                                {[{ name: 'Ana Paula', amount: 'Kz 10.000.000' }, { name: 'Carlos Manuel', amount: 'Kz 5.500.000' }, { name: 'Isabel Santos', amount: 'Kz 13.000.000' }].map((investor, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">INV</div>
                                                            <span className="text-sm font-medium">{investor.name}</span>
                                                        </div>
                                                        <span className="text-sm font-bold">{investor.amount}</span>
                                                    </div>
                                                ))}
                                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <span className="material-symbols-outlined text-slate-400">add_circle</span>
                                                    <span className="text-sm font-medium text-slate-500 ml-2">Adicionar Investidor</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}