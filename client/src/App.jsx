import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    description: ''
  });

  const addTask = () => {
    if (formData.title.trim() !== '') {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          ...formData,
          completed: false
        }
      ]);
      setFormData({
        title: '',
        date: '',
        category: '',
        description: ''
      });
      setShowModal(false);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const colors = darkMode ? {
    bg: '#1A1A1A',
    bgSecondary: '#242424',
    bgTertiary: '#2D2D2D',
    text: '#E8E8E8',
    textSecondary: '#999',
    border: '#3A3A3A',
    input: '#1F1F1F',
    button: '#E8E8E8',
    buttonText: '#1A1A1A'
  } : {
    bg: '#F8F8F6',
    bgSecondary: 'white',
    bgTertiary: '#FCFCF8',
    text: '#4A4A4A',
    textSecondary: '#999',
    border: '#EFEFEB',
    input: '#FCFCF8',
    button: '#4A4A4A',
    buttonText: 'white'
  };

  const getCategoryColor = (category) => {
    if (darkMode) {
      switch (category) {
        case 'High':
          return { bg: '#3A2A2D', text: '#E8B8B8' };
        case 'Medium':
          return { bg: '#3A3A2A', text: '#E8D8B8' };
        case 'Low':
          return { bg: '#2A3A3A', text: '#B8D8D8' };
        default:
          return { bg: '#333', text: '#AAA' };
      }
    } else {
      switch (category) {
        case 'High':
          return { bg: '#F5E6E8', text: '#6B5B6B' };
        case 'Medium':
          return { bg: '#F5F0E6', text: '#6B6B5B' };
        case 'Low':
          return { bg: '#E6F5F0', text: '#5B6B6B' };
        default:
          return { bg: '#F0F0F0', text: '#666' };
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: colors.input,
    color: colors.text,
    transition: 'all 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.text,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        minHeight: '100vh',
        background: darkMode ? 'linear-gradient(135deg, #1A1A1A 0%, #242424 100%)' : 'linear-gradient(135deg, #F8F8F6 0%, #EFEFEB 100%)',
        padding: '40px 20px',
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        transition: 'background 0.3s ease'
      }}
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header with Dark Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginBottom: '40px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '300',
              color: colors.text,
              margin: '0 0 8px 0',
              letterSpacing: '0.5px',
              transition: 'color 0.3s'
            }}>
              My Tasks
            </h1>
            <p style={{
              fontSize: '14px',
              color: colors.textSecondary,
              margin: '0',
              fontWeight: '400',
              transition: 'color 0.3s'
            }}>
              Organize your thoughts
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </motion.button>
        </motion.div>

        {/* Main Container */}
        <motion.div
          style={{
            background: colors.bgSecondary,
            borderRadius: '12px',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
            padding: '40px 30px',
            border: `1px solid ${colors.border}`,
            transition: 'all 0.3s'
          }}
        >
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '40px'
            }}
          >
            {[
              { label: 'Total', value: tasks.length, bg: darkMode ? '#2D2D2D' : '#F5F5F5' },
              { label: 'Completed', value: tasks.filter(t => t.completed).length, bg: darkMode ? '#2A3A3A' : '#F0F8F5' },
              { label: 'Pending', value: tasks.filter(t => !t.completed).length, bg: darkMode ? '#3A3A2A' : '#F8F5F0' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                style={{
                  background: stat.bg,
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: `1px solid ${colors.border}`,
                  cursor: 'default',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  fontSize: '32px',
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: '4px',
                  transition: 'color 0.3s'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'color 0.3s'
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Add Task Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowModal(true)}
            style={{
              width: '100%',
              padding: '14px',
              background: colors.button,
              color: colors.buttonText,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '30px',
              letterSpacing: '0.3px',
              transition: 'all 0.2s'
            }}
          >
            + Add New Task
          </motion.button>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: colors.textSecondary
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                opacity: 0.3
              }}>
                ✎
              </div>
              <p style={{
                fontSize: '16px',
                color: colors.textSecondary,
                margin: '0',
                fontWeight: '400',
                transition: 'color 0.3s'
              }}>
                No tasks yet
              </p>
              <p style={{
                fontSize: '13px',
                color: colors.textSecondary,
                margin: '8px 0 0 0',
                fontWeight: '300',
                opacity: 0.7,
                transition: 'color 0.3s'
              }}>
                Start by adding a new task
              </p>
            </motion.div>
          ) : (
            <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    variants={taskVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    style={{
                      padding: '16px',
                      background: task.completed ? colors.bgTertiary : darkMode ? '#2A2A2A' : '#FAFAF8',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      cursor: 'default',
                      transition: 'all 0.2s'
                    }}
                    whileHover={{ backgroundColor: task.completed ? colors.bgTertiary : darkMode ? '#2E2E2E' : '#FCFCF8' }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <motion.input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          marginTop: '2px',
                          accentColor: colors.textSecondary
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: task.completed ? '400' : '500',
                          color: task.completed ? colors.textSecondary : colors.text,
                          margin: '0 0 8px 0',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          opacity: task.completed ? 0.6 : 1,
                          transition: 'all 0.2s'
                        }}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p style={{
                            fontSize: '13px',
                            color: colors.textSecondary,
                            margin: '6px 0 8px 0',
                            fontWeight: '400',
                            transition: 'color 0.3s'
                          }}>
                            {task.description}
                          </p>
                        )}
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                          alignItems: 'center'
                        }}>
                          {task.date && (
                            <span style={{
                              fontSize: '12px',
                              background: darkMode ? '#333' : '#F0F0F0',
                              color: colors.textSecondary,
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontWeight: '400',
                              transition: 'all 0.3s'
                            }}>
                              {task.date}
                            </span>
                          )}
                          {task.category && (() => {
                            const color = getCategoryColor(task.category);
                            return (
                              <span style={{
                                fontSize: '12px',
                                background: color.bg,
                                color: color.text,
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontWeight: '500',
                                transition: 'all 0.3s'
                              }}>
                                {task.category}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => deleteTask(task.id)}
                        style={{
                          padding: '6px 12px',
                          background: darkMode ? '#3A2A2A' : '#F0F0F0',
                          color: colors.textSecondary,
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: '0',
              background: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '50',
              backdropFilter: 'blur(2px)'
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: colors.bgSecondary,
                borderRadius: '12px',
                boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.12)',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: `1px solid ${colors.border}`,
                transition: 'all 0.3s'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '30px',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: colors.text,
                  margin: '0',
                  transition: 'color 0.3s'
                }}>
                  Add Task
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: colors.textSecondary,
                    padding: '0',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.3s'
                  }}
                >
                  ×
                </motion.button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Title Input */}
                <div>
                  <label style={labelStyle}>Title</label>
                  <motion.input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Task title"
                    style={inputStyle}
                  />
                </div>

                {/* Date Input */}
                <div>
                  <label style={labelStyle}>Due Date</label>
                  <motion.input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label style={labelStyle}>Priority</label>
                  <motion.select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </motion.select>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Notes</label>
                  <motion.textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add any details..."
                    style={{
                      ...inputStyle,
                      minHeight: '100px',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: `1px solid ${colors.border}`,
                      background: colors.bgTertiary,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: colors.text,
                      transition: 'all 0.2s'
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={addTask}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: colors.button,
                      color: colors.buttonText,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Save Task
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

